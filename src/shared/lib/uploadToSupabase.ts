import { supabaseClient } from "./supabase-client";

export async function uploadFileToSupabase(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabaseClient.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
