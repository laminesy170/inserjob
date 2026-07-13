import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies } as any);

    const tokenHash = require('crypto')
      .createHash('sha256')
      .update(
        params.token +
          ':' +
          (process.env.INVITATION_TOKEN_PEPPER || '')
      )
      .digest('hex');

    // Find invitation
    const { data: invitation, error: invError } = await (supabase as any)
      .from('invitations')
      .select('*, questionnaires(*)')
      .eq('token_hash', tokenHash)
      .single();

    if (invError || !invitation) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
    }

    // Check if session exists
    const { data: existing } = await (supabase as any)
      .from('assessment_sessions')
      .select('*')
      .eq('invitation_id', invitation.id)
      .eq('status', 'DRAFT')
      .single();

    let sessionId: string;

    if (existing) {
      sessionId = existing.id;
    } else {
      // Create new session
      sessionId = uuid();
      const { error: createError } = await (supabase as any)
        .from('assessment_sessions')
        .insert([
          {
            id: sessionId,
            invitation_id: invitation.id,
            questionnaire_id: invitation.questionnaire_id,
            questionnaire_snapshot_json: invitation.questionnaires.schema_json,
            scoring_snapshot_json: { version: '1.0.0' },
            status: 'IN_PROGRESS',
            progress_percent: 0,
            started_at: new Date().toISOString(),
          },
        ]);

      if (createError) {
        return NextResponse.json(
          { error: 'Failed to create session' },
          { status: 500 }
        );
      }

      // Update invitation status
      await (supabase as any)
        .from('invitations')
        .update({ status: 'EN_COURS', started_at: new Date().toISOString() })
        .eq('id', invitation.id);
    }

    return NextResponse.json({
      sessionId,
      questionnaire: invitation.questionnaires.schema_json,
    });
  } catch (error: any) {
    console.error('POST /start error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
