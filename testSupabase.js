
import { supabase } from './utils/supabase.js';

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('test').select('*').limit(1);
    console.log('✅ Supabase connection success:', data);
    if (error) console.error('⚠️ Supabase returned error:', error);
  } catch (err) {
    console.error('❌ Supabase setup error:', err);
  }
}

testSupabaseConnection();
