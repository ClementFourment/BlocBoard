import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Erreur récupération session :', error.message);
    return null;
  }
  return data.session?.user ?? null;
};


export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erreur lors de la déconnexion :', error.message);
    return false;
  }
  return true;
};
