import { supabase } from './supabase';
import { UserProfile } from '@/types';

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      username,
      total_xp: 0,
      level: 1,
      streak: 0,
    });
    if (profileError) throw profileError;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;

  return {
    id: data.id,
    email: data.email,
    username: data.username,
    avatarUrl: data.avatar_url,
    totalXp: data.total_xp,
    level: data.level,
    streak: data.streak,
    lastPlayedAt: data.last_played_at,
    completedCategories: data.completed_categories ?? [],
  };
}

export async function updateXp(userId: string, xpToAdd: number): Promise<void> {
  const { data } = await supabase
    .from('profiles')
    .select('total_xp')
    .eq('id', userId)
    .single();

  if (!data) return;

  const newXp = data.total_xp + xpToAdd;
  const newLevel = Math.floor(newXp / 500) + 1;

  await supabase
    .from('profiles')
    .update({ total_xp: newXp, level: newLevel, last_played_at: new Date().toISOString() })
    .eq('id', userId);
}
