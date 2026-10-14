import { createClient } from '@supabase/supabase-js';

const getValidSupabaseUrl = () => {
  let url = import.meta.env.VITE_SUPABASE_URL;
  if (typeof url === 'string') {
    url = url.trim();
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      if (!url.includes('.') && !url.includes(' ') && !url.includes('/')) {
        url = `https://${url}.supabase.co`;
      } else if (url.includes('.') && !url.includes(' ')) {
        url = `https://${url}`;
      }
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        new URL(url);
        return url;
      } catch (e) {
        // Fall back to default placeholder if URL parsing fails
      }
    }
  }
  return 'https://placeholder.supabase.co';
};

const supabaseUrl = getValidSupabaseUrl();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
