import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveScore = async (name: string, score: number, imageUrl: string) => {
  const { data, error } = await supabase
    .from('scores')
    .insert([{ name, score, image_url: imageUrl }])
    .select();

  if (error) {
    console.error('Error saving score:', error);
  }

  return data;
};

export const getScores = async () => {
  const { data, error } = await supabase
    .from('scores')
    .select('name, score, image_url')
    .order('score', { ascending: false });

  if (error) {
    console.error('Error fetching scores:', error);
    return [];
  }

  return data;
};

