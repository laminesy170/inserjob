import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { brevoService } from '@/lib/email/brevo';

// Email templates (IDs should be configured in Brevo)
const TEMPLATE_IDS = {
  INVITATION: 1, // Invitation de questionnaire
  REMINDER: 2, // Rappel d'invitation
  COMPLETED: 3, // Rapport généré
  CANCELLED: 4, // Invitation annulée
};

const TEMPLATE_SUBJECTS: Record<string, string> = {
  INVITATION: 'Vous êtes invité à répondre au questionnaire CapOrientation 360',
  REMINDER: 'Rappel: Répondez au questionnaire CapOrientation 360',
  COMPLETED: 'Votre rapport CapOrientation 360 est prêt',
  CANCELLED: 'Votre invitation a été annulée',
};

export async function POST(request: NextRequest) {
  // Verify request has correct auth header
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServerComponentClient({ cookies } as any);

    // Get pending emails
    const { data: pendingEmails } = await (supabase as any)
      .from('email_outbox')
      .select('*')
      .eq('status', 'PENDING')
      .lt('created_at', new Date(Date.now() - 5 * 60000).toISOString()) // At least 5 minutes old
      .limit(10); // Process in batches

    if (!pendingEmails || pendingEmails.length === 0) {
      return NextResponse.json({ processed: 0 });
    }

    let processed = 0;
    let failed = 0;

    for (const email of pendingEmails) {
      try {
        const templateId = TEMPLATE_IDS[email.message_type as keyof typeof TEMPLATE_IDS] || 1;
        const subject = TEMPLATE_SUBJECTS[email.message_type] || 'CapOrientation 360';

        // Send via Brevo
        const result = await brevoService.sendTemplateEmail({
          templateId,
          to: [
            {
              email: email.recipient,
              name: email.template_data_json?.beneficiaryName || email.recipient,
            },
          ],
          params: email.template_data_json || {},
        });

        // Mark as sent
        await (supabase as any)
          .from('email_outbox')
          .update({
            status: 'SENT',
            sent_at: new Date().toISOString(),
            external_message_id: result.id,
          })
          .eq('id', email.id);

        processed++;
      } catch (error: any) {
        console.error(`Failed to send email ${email.id}:`, error);

        // Increment retry count
        const retries = (email.retry_count || 0) + 1;
        const shouldMarkFailed = retries > 5;

        await (supabase as any)
          .from('email_outbox')
          .update({
            status: shouldMarkFailed ? 'FAILED' : 'PENDING',
            retry_count: retries,
            last_error: error.message,
          })
          .eq('id', email.id);

        failed++;
      }
    }

    return NextResponse.json({
      processed,
      failed,
      total: pendingEmails.length,
    });
  } catch (error: any) {
    console.error('Email processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
