import { useState, useCallback } from "react";
import { uploadPhoto } from "@/lib/supabaseHelpers";

export function useUpload() {
  const [preview,    setPreview]    = useState<string | null>(null);
  const [uploadedUrl, setUploaded]  = useState<string | null>(null);
  const [uploading,  setUploading]  = useState(false);
  const [uploadErr,  setUploadErr]  = useState("");

  const loadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadErr("Please upload an image file.");
      return;
    }
    setUploadErr("");

    // Show instant preview via FileReader
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to Supabase Storage in the background
    setUploading(true);
    try {
      const url = await uploadPhoto(file);
      setUploaded(url);
    } catch (err) {
      console.error("Upload failed:", err);
      // Non-blocking: we still have the base64 preview
    } finally {
      setUploading(false);
    }
  }, []);

  const clearPhoto = useCallback(() => {
    setPreview(null);
    setUploaded(null);
  }, []);

  return { preview, uploadedUrl, uploading, uploadErr, loadFile, clearPhoto };
}
