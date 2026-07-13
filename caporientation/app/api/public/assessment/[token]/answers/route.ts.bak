import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { submitAnswersSchema } from '@/lib/validation/schemas';

export async function PUT(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies } as any);
    const body = await request.json();
    const { answers } = submitAnswersSchema.parse(body);

    const tokenHash = require('crypto')
      .createHash('sha256')
      .update(
        params.token +
          ':' +
          (process.env.INVITATION_TOKEN_PEPPER || '')
      )
      .digest('hex');

    // Find session
    const { data: invitation } = await (supabase as any)
      .from('invitations')
      .select('id')
      .eq('token_hash', tokenHash)
      .single();

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
    }

    const { data: session } = await (supabase as any)
      .from('assessment_sessions')
      .select('id')
      .eq('invitation_id', invitation.id)
      .eq('status', 'IN_PROGRESS')
      .single();

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Save answers (upsert)
    for (const answer of answers) {
      const effectiveValue = answer.value; // TODO: Apply reverse scoring if needed

      await (supabase as any)
        .from('answers')
        .upsert([
          {
            session_id: session.id,
            question_id: answer.questionId,
            raw_value: answer.value,
            effective_value: effectiveValue,
            answered_at: new Date().toISOString(),
          },
        ]);
    }

    // Update last saved
    await (supabase as any)
      .from('assessment_sessions')
      .update({ last_saved_at: new Date().toISOString() })
      .eq('id', session.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PUT /answers error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
