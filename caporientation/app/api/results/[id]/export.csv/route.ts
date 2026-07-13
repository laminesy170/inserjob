import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const LEVEL_LABELS: Record<string, string> = {
  TO_STRENGTHEN: 'A renforcer',
  IN_DEVELOPMENT: 'En développement',
  OPERATIONAL: 'Opérationnel',
  AUTONOMOUS: 'Autonome',
};

function escapeCSV(str: string): string {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function getLevel(score: number): string {
  if (score <= 39) return 'TO_STRENGTHEN';
  if (score <= 59) return 'IN_DEVELOPMENT';
  if (score <= 79) return 'OPERATIONAL';
  return 'AUTONOMOUS';
}

export async function GET(
  _request: NextRequest,
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
    const rows: string[] = [];
    const overallLevel = LEVEL_LABELS[getLevel(resultJson.overallScore)] || 'Autonome';

    // Header
    rows.push('Dimension,Score,Niveau');

    // Dimensions
    if (resultJson.dimensions) {
      resultJson.dimensions.forEach((dim: any) => {
        const level = LEVEL_LABELS[dim.level] || dim.level;
        rows.push(
          `${escapeCSV(dim.dimensionLabel)},${dim.normalizedScore},${escapeCSV(level)}`
        );
      });
    }

    // Summary
    rows.push('');
    rows.push(`Score global,${resultJson.overallScore},${escapeCSV(overallLevel)}`);

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv; charset=utf-8;' });

    return new NextResponse(blob, {
      headers: {
        'Content-Disposition': `attachment; filename="rapport-${params.id}.csv"`,
        'Content-Type': 'text/csv; charset=utf-8;',
      },
    });
  } catch (error: any) {
    console.error('GET /results/[id]/export.csv error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
