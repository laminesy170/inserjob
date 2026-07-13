/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceRoleClient } from '@/lib/supabase';
import type { EmailOutbox } from '@/db/types';

export interface EmailJob {
  organizationId: string;
  invitationId?: string;
  messageType: string;
  recipient: string;
  templateData: Record<string, any>;
}

export class EmailOutboxManager {
  async enqueue(
    job: EmailJob,
    idempotencyKey: string
  ): Promise<string> {
    const supabase = createServiceRoleClient() as any;

    const { data, error } = await supabase
      .from('email_outbox')
      .insert([
        {
          organization_id: job.organizationId,
          invitation_id: job.invitationId || null,
          message_type: job.messageType,
          recipient: job.recipient,
          template_data_json: job.templateData,
          idempotency_key: idempotencyKey,
          status: 'PENDING',
          attempt_count: 0,
          next_attempt_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to enqueue email: ${error.message}`);
    }

    return (data as any).id;
  }

  async getPending(limit: number = 50): Promise<EmailOutbox[]> {
    const supabase = createServiceRoleClient() as any;

    const { data, error } = await supabase
      .from('email_outbox')
      .select('*')
      .eq('status', 'PENDING')
      .lte('next_attempt_at', new Date().toISOString())
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch pending emails: ${error.message}`);
    }

    return data || [];
  }

  async markSent(
    id: string,
    providerMessageId: string
  ): Promise<void> {
    const supabase = createServiceRoleClient() as any;

    const { error } = await supabase
      .from('email_outbox')
      .update({
        status: 'SENT',
        provider_message_id: providerMessageId,
        sent_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to mark email as sent: ${error.message}`);
    }
  }

  async markFailed(
    id: string,
    errorMsg: string,
    retryable: boolean = true
  ): Promise<void> {
    const supabase = createServiceRoleClient() as any;

    const updateData: any = {
      last_error: errorMsg,
    };

    if (!retryable) {
      updateData.status = 'FAILED';
    } else {
      // Exponential backoff: 5, 10, 20, 40 minutes
      const nextAttempt = new Date();
      nextAttempt.setMinutes(
        nextAttempt.getMinutes() + Math.pow(2, Math.min(5, 5))
      );
      updateData.next_attempt_at = nextAttempt.toISOString();
    }

    const { error: updateError } = await supabase
      .from('email_outbox')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      throw new Error(`Failed to mark email as failed: ${updateError.message}`);
    }
  }
}
