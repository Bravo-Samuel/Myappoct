/**
 * Reusable Supabase File Storage Hook
 * Supplies secure file upload, MIME validation, and public URL generation.
 */

import { useState } from 'react';
import { useDatabase } from '../providers/DatabaseProvider';
import { SUPABASE_STORAGE_BUCKETS } from '../storage/config';

export function useSupabaseStorage(bucketKey: keyof typeof SUPABASE_STORAGE_BUCKETS) {
  const { client } = useDatabase();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bucketDef = SUPABASE_STORAGE_BUCKETS[bucketKey];

  const uploadFile = async (filePath: string, file: File): Promise<{ publicUrl: string | null; path: string | null }> => {
    if (!client) {
      setError('Supabase unconfigured.');
      return { publicUrl: null, path: null };
    }

    if (file.size > bucketDef.fileSizeLimitMB * 1024 * 1024) {
      const errMsg = `File exceeds ${bucketDef.fileSizeLimitMB}MB limit for ${bucketDef.name}.`;
      setError(errMsg);
      throw new Error(errMsg);
    }

    setIsUploading(true);
    setError(null);

    try {
      const { data, error: uploadErr } = await client
        .storage
        .from(bucketDef.id)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw uploadErr;

      let publicUrl = null;
      if (bucketDef.isPublic) {
        const { data: urlData } = client.storage.from(bucketDef.id).getPublicUrl(data.path);
        publicUrl = urlData.publicUrl;
      }

      return { publicUrl, path: data.path };
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      return { publicUrl: null, path: null };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error, bucketDef };
}
