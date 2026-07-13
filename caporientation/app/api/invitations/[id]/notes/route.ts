import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { requireCounselor } from '@/lib/auth';
import { z } from 'zod';

const createNoteSchema = z.object({
  content: z.string().min(1).max(5000),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireCounselor();
    const supabase = createServerComponentClient({ cookies } as any);

    // Get notes for this invitation
    const { data: notes } = await (supabase as any)
      .from('counselor_notes')
      .select('*')
      .eq('invitation_id', params.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ notes: notes || [] });
  } catch (error: any) {
    console.error('GET /invitations/[id]/notes error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireCounselor();
    const supabase = createServerComponentClient({ cookies } as any);
    const body = await request.json();

    // Validate input
    const validated = createNoteSchema.parse(body);

    // Get invitation to verify access
    const { data: invitation } = await (supabase as any)
      .from('invitations')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Create note
    const { data, error } = await (supabase as any)
      .from('counselor_notes')
      .insert([
        {
          invitation_id: params.id,
          counselor_id: user.id,
          content: validated.content,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('POST /invitations/[id]/notes error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
