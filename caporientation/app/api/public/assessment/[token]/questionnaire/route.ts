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

    const tokenHash = hashToken(params.token, process.env.INVITATION_TOKEN_PEPPER || '');

    const { data: invitation } = await (supabase as any)
      .from('invitations')
      .select('*, questionnaires(schema_json)')
      .eq('token_hash', tokenHash)
      .single();

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
    }

    if (invitation.status === 'EXPIREE') {
      return NextResponse.json(
        { error: 'Invitation expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      questionnaire: invitation.questionnaires.schema_json,
    });
  } catch (error: any) {
    console.error('GET /questionnaire error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
