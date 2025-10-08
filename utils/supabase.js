import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Upload file using standard upload
export async function uploadFile(file, file_path) {
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(file_path, file.buffer, {
      upsert: true,
      contentType: file.mimetype,
    });
  if (error) {
    throw new Error(error);
  } else {
    return data.path;
  }
}
