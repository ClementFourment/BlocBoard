import 'dotenv/config';
import appJson from './app.json';

export default ({ config }) => ({
  ...config,
  ...appJson,
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
});
