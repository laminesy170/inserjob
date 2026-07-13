import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { hashToken } from '@/lib/crypto';

export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies } as any);

    // Find invitation by token hash
    const tokenHash = hashToken(params.token, process.env.INVITATION_TOKEN_PEPPER || '');

    const { data: invitation, error } = await (supabase as any)
      .from('invitations')
      .select('*, questionnaires(*)')
      .eq('token_hash', tokenHash)
      .single();

    if (error || !invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Check expiration
    if (new Date(invitation.token_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Invitation expired' },
        { status: 410 }
      );
    }

    // Check status
    if (!['INVITATION_ENVOYEE', 'CONSULTEE', 'EN_COURS'].includes(invitation.status)) {
      return NextResponse.json(
        { error: 'Invitation no longer active' },
        { status: 403 }
      );
    }

    // Return safe metadata
    return NextResponse.json({
      invitationId: invitation.id,
      beneficiaryName: invitation.beneficiary_display_name,
      questionnaire: {
        id: invitation.questionnaires.id,
        title: invitation.questionnaires.title,
        estimatedDuration: invitation.questionnaires.schema_json.questionnaire
          .estimatedDurationMinutes,
      },
      reportToBeneficiary: invitation.report_to_beneficiary,
    });
  } catch (error: any) {
    console.error('GET /public/assessment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
