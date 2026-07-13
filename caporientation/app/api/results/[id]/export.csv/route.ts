import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

function escapeCSV(str: string): string {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

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
    const rows: string[] = [];

    // Header
    rows.push('Dimension,Score,Niveau');

    // Dimensions
    if (resultJson.dimensions) {
      resultJson.dimensions.forEach((dim: any) => {
        rows.push(
          `${escapeCSV(dim.dimensionTitle)},${dim.score},${escapeCSV(dim.level)}`
        );
      });
    }

    // Summary
    rows.push('');
    rows.push(`Score global,${resultJson.overallScore},${escapeCSV(resultJson.level)}`);

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
