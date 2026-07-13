import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { requireCounselor } from '@/lib/auth';

export async function POST(
  request: NextRequest,
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

    // Can only cancel pending or in-progress invitations
    if (!['INVITATION_ENVOYEE', 'EN_COURS'].includes(invitation.status)) {
      return NextResponse.json(
        { error: 'Cannot cancel invitation in this status' },
        { status: 400 }
      );
    }

    // Update invitation status
    const { error } = await (supabase as any)
      .from('invitations')
      .update({ status: 'ANNULEE', cancelled_at: new Date().toISOString() })
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to cancel invitation' },
        { status: 500 }
      );
    }

    // Queue cancellation notification email
    await (supabase as any)
      .from('email_outbox')
      .insert([
        {
          organization_id: invitation.organization_id,
          invitation_id: invitation.id,
          message_type: 'CANCELLED',
          recipient: invitation.beneficiary_email,
          template_data_json: {
            beneficiaryName: invitation.beneficiary_display_name,
          },
          idempotency_key: `cancel-${invitation.id}`,
          status: 'PENDING',
        },
      ]);

    return NextResponse.json({
      success: true,
      message: 'Invitation cancelled',
    });
  } catch (error: any) {
    console.error('POST /invitations/[id]/cancel error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
