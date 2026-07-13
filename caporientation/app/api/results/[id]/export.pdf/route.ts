import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const LEVEL_LABELS: Record<string, string> = {
  TO_STRENGTHEN: 'À renforcer',
  IN_DEVELOPMENT: 'En développement',
  OPERATIONAL: 'Opérationnel',
  AUTONOMOUS: 'Autonome',
};

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
    const overallLevel = LEVEL_LABELS[getLevel(resultJson.overallScore)] || 'Autonome';

    const dimensionsHtml = resultJson.dimensions
      .map(
        (dim: any) => `
      <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eeeeee;">
        <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #1f2937;">
          ${dim.dimensionLabel}
        </h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 11px; color: #666666;">
          <span>Score: ${dim.normalizedScore}/100</span>
          <span>${LEVEL_LABELS[dim.level] || dim.level}</span>
        </div>
        <p style="font-size: 10px; color: #555555; margin-bottom: 8px; line-height: 1.5;">
          ${dim.summary}
        </p>
        ${
          dim.recommendedActions && dim.recommendedActions.length > 0
            ? `
            <div style="font-size: 10px; color: #555555; margin-top: 8px;">
              <strong style="display: block; margin-bottom: 5px;">Pistes d&apos;amélioration :</strong>
              ${dim.recommendedActions
                .map((action: string) => `<div style="margin-bottom: 5px; margin-left: 10px;">• ${action}</div>`)
                .join('')}
            </div>
          `
            : ''
        }
      </div>
    `
      )
      .join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rapport CapOrientation 360</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
        h1 { color: #0ea5e9; font-size: 24px; margin-bottom: 10px; }
        .subtitle { color: #666; font-size: 12px; margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 20px; }
        .score-box {
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          padding: 20px;
          text-align: center;
          margin: 20px 0 30px;
          border-radius: 4px;
        }
        .score-value {
          font-size: 36px;
          font-weight: bold;
          color: #0ea5e9;
          margin-bottom: 5px;
        }
        .score-label {
          font-size: 14px;
          color: #333;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 9px;
          color: #999;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>CapOrientation 360</h1>
      <div class="subtitle">Rapport d&apos;auto-positionnement professionnel</div>

      <div class="score-box">
        <div class="score-value">${resultJson.overallScore}</div>
        <div class="score-label">${overallLevel}</div>
      </div>

      <h2>Vos scores par dimension</h2>
      ${dimensionsHtml}

      <div class="footer">
        <p>Rapport généré le ${new Date(result.generated_at).toLocaleDateString('fr-FR')}</p>
        <p>CapOrientation 360 © 2024</p>
      </div>
    </body>
    </html>
  `;

    const buffer = Buffer.from(htmlContent);

    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `inline; filename="rapport-${params.id}.html"`,
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('GET /results/[id]/export.pdf error:', error);
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
