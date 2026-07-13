import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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

    const blob = new Blob([JSON.stringify(result.result_json, null, 2)], {
      type: 'application/json',
    });

    return new NextResponse(blob, {
      headers: {
        'Content-Disposition': `attachment; filename="rapport-${params.id}.json"`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('GET /results/[id]/export.json error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
