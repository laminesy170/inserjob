import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createInvitationSchema } from '@/lib/validation/schemas';
import { generateInvitationToken } from '@/lib/security/token';
import { v4 as uuid } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies } as any);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile for organization
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const input = createInvitationSchema.parse(body);

    // Generate token
    const { token, hash } = generateInvitationToken();

    // Create invitation
    const { data: invitation, error } = await (supabase as any)
      .from('invitations')
      .insert([
        {
          id: uuid(),
          organization_id: profile.organization_id,
          counselor_id: user.id,
          questionnaire_id: input.questionnaireId,
          beneficiary_display_name: input.beneficiaryDisplayName,
          beneficiary_email: input.beneficiaryEmail,
          internal_reference: input.internalReference || null,
          token_hash: hash,
          token_expires_at: input.expiresAt,
          status: 'INVITATION_ENVOYEE',
          report_to_beneficiary: input.reportToBeneficiary,
          language: input.language,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Invitation creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      );
    }

    // Queue email
    const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/assess/${token}`;
    await (supabase as any)
      .from('email_outbox')
      .insert([
        {
          organization_id: profile.organization_id,
          invitation_id: invitation.id,
          message_type: 'INVITATION',
          recipient: input.beneficiaryEmail,
          template_data_json: {
            beneficiaryName: input.beneficiaryDisplayName,
            invitationLink,
            expiresAt: input.expiresAt,
          },
          idempotency_key: `inv-${invitation.id}`,
          status: 'PENDING',
        },
      ]);

    return NextResponse.json({
      id: invitation.id,
      status: 'INVITATION_ENVOYEE',
      token: token, // Return token once to the creator
      createdAt: invitation.created_at,
    });
  } catch (error: any) {
    console.error('POST /invitations error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies } as any);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    let query = (supabase as any)
      .from('invitations')
      .select('*', { count: 'exact' })
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total: count,
        pages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error: any) {
    console.error('GET /invitations error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
