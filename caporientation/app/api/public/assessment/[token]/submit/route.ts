import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ScoringEngine } from '@/lib/scoring/engine';
import { scoringRulesV1 } from '@/lib/scoring/rules';
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

    // Get invitation and session
    const { data: invitation } = await (supabase as any)
      .from('invitations')
      .select('*, questionnaires(*)')
      .eq('token_hash', tokenHash)
      .single();

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
    }

    const { data: session } = await (supabase as any)
      .from('assessment_sessions')
      .select('*')
      .eq('invitation_id', invitation.id)
      .eq('status', 'IN_PROGRESS')
      .single();

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get all answers
    const { data: answers } = await (supabase as any)
      .from('answers')
      .select('*')
      .eq('session_id', session.id);

    if (!answers || answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers found' },
        { status: 400 }
      );
    }

    // Check all questions answered
    const questionnaire = invitation.questionnaires.schema_json;
    const allQuestions = questionnaire.questionnaire.dimensions.flatMap(
      (d: any) => d.questions.map((q: any) => q.id)
    );
    const answeredQuestions = new Set(answers.map((a: any) => a.question_id));

    if (answeredQuestions.size !== allQuestions.length) {
      return NextResponse.json(
        { error: 'Not all questions answered' },
        { status: 400 }
      );
    }

    // Calculate scores
    const engine = new ScoringEngine(questionnaire, scoringRulesV1);
    const answerInput = answers.map((a: any) => ({
      questionId: a.question_id,
      rawValue: a.raw_value,
    }));

    let scoringResult;
    try {
      scoringResult = engine.score(answerInput);
    } catch (error) {
      console.error('Scoring error:', error);
      return NextResponse.json(
        { error: 'Failed to calculate scores' },
        { status: 500 }
      );
    }

    // Save results
    const resultId = uuid();
    const { error: resultError } = await (supabase as any)
      .from('assessment_results')
      .insert([
        {
          id: resultId,
          session_id: session.id,
          questionnaire_version: questionnaire.questionnaire.version,
          scoring_version: scoringRulesV1.version,
          overall_score: scoringResult.overallScore,
          result_json: scoringResult,
          generated_at: new Date().toISOString(),
        },
      ]);

    if (resultError) {
      console.error('Result save error:', resultError);
      return NextResponse.json(
        { error: 'Failed to save results' },
        { status: 500 }
      );
    }

    // Update session and invitation
    await (supabase as any)
      .from('assessment_sessions')
      .update({
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', session.id);

    await (supabase as any)
      .from('invitations')
      .update({
        status: 'RAPPORT_GENERE',
        completed_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);

    // Queue notification email to counselor
    await (supabase as any)
      .from('email_outbox')
      .insert([
        {
          organization_id: invitation.organization_id,
          invitation_id: invitation.id,
          message_type: 'COMPLETED',
          recipient: 'counselor@example.com', // TODO: Get from profile
          template_data_json: {
            beneficiaryName: invitation.beneficiary_display_name,
            overallScore: scoringResult.overallScore,
            reportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/results/${resultId}`,
          },
          idempotency_key: `comp-${resultId}`,
          status: 'PENDING',
        },
      ]);

    return NextResponse.json({
      status: 'RAPPORT_GENERE',
      beneficiarySummary: {
        dimensions: scoringResult.dimensions,
        overallScore: scoringResult.overallScore,
      },
    });
  } catch (error: any) {
    console.error('POST /submit error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
