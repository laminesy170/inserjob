import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { requireCounselor } from '@/lib/auth';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireCounselor();
    const supabase = createServerComponentClient({ cookies } as any);

    const { data: invitation } = await (supabase as any)
      .from('invitations')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Queue reminder email
    await (supabase as any)
      .from('email_outbox')
      .insert([
        {
          organization_id: invitation.organization_id,
          invitation_id: invitation.id,
          message_type: 'REMINDER',
          recipient: invitation.beneficiary_email,
          template_data_json: {
            beneficiaryName: invitation.beneficiary_display_name,
            invitationLink: `${process.env.NEXT_PUBLIC_APP_URL}/public/assessment/${invitation.token}`,
            expiresAt: invitation.expires_at,
          },
          idempotency_key: `reminder-${invitation.id}-${Date.now()}`,
          status: 'PENDING',
        },
      ]);

    return NextResponse.json({
      success: true,
      message: 'Reminder email queued',
    });
  } catch (error: any) {
    console.error('POST /invitations/[id]/remind error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
