import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;


let supabaseClient: SupabaseClient | null = null;

// export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//   auth: {
//     storage: AsyncStorage
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   }
// });


function getSupabaseClient(): SupabaseClient {
	if (supabaseClient) return supabaseClient;

	let storage;
	if (typeof window !== 'undefined') {
		storage = require('@react-native-async-storage/async-storage').default;
	}

	supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		auth: {
		storage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
		},
	});
	return supabaseClient;
}

export const supabase = getSupabaseClient();
