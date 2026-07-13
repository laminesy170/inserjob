import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies } as any);

    const { error } = await (supabase as any).auth.signOut();

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    // Redirect to login page
    return NextResponse.redirect(new URL('/auth/login', request.url));
  } catch (error: any) {
    console.error('POST /auth/logout error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
