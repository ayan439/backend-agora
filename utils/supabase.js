import 'react-native-url-polyfill/auto.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sjndfpvziskjhtziufzk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqbmRmcHZ6aXNramh0eml1ZnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2ODUxNDcsImV4cCI6MjA3ODI2MTE0N30.sz7BfwUGjreFKLU5nmrGqlX3Uy-jwZcyNYVBVlJilzc';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;