/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Database } from '@/db/types';

export async function getSession() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  } as any);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function getCurrentUser() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  } as any);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const supabase = createServerComponentClient<Database>({
    cookies,
  } as any);

  const { data: profile, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    redirect('/auth/login');
  }

  return profile;
}

export async function requireAdmin() {
  const profile = await getProfile();

  if ((profile as any).role !== 'ADMIN') {
    redirect('/');
  }

  return profile;
}

export async function requireCounselor() {
  const profile = await getProfile();

  if (!['ADMIN', 'COUNSELOR'].includes((profile as any).role)) {
    redirect('/');
  }

  return profile;
}
