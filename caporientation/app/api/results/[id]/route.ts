import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const LEVEL_LABELS: Record<string, string> = {
  TO_STRENGTHEN: 'A renforcer',
  IN_DEVELOPMENT: 'En développement',
  OPERATIONAL: 'Opérationnel',
  AUTONOMOUS: 'Autonome',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies } as any);

    const { data: result } = await (supabase as any)
      .from('assessment_results')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!result) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    const resultJson = result.result_json;

    // Map scoring engine output to presentation format
    const mappedResult = {
      overallScore: resultJson.overallScore,
      level: LEVEL_LABELS[getLevel(resultJson.overallScore)] || 'Autonome',
      dimensions: resultJson.dimensions.map((dim: any) => ({
        dimensionId: dim.dimensionId,
        dimensionTitle: dim.dimensionLabel,
        score: dim.normalizedScore,
        level: LEVEL_LABELS[dim.level] || dim.level,
        interpretation: dim.summary,
        recommendations: dim.recommendedActions || [],
      })),
      generatedAt: result.generated_at,
    };

    return NextResponse.json(mappedResult);
  } catch (error: any) {
    console.error('GET /results/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

function getLevel(score: number): string {
  if (score <= 39) return 'TO_STRENGTHEN';
  if (score <= 59) return 'IN_DEVELOPMENT';
  if (score <= 79) return 'OPERATIONAL';
  return 'AUTONOMOUS';
}
