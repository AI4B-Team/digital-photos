import { useState, useCallback } from "react";
import { uploadPhoto } from "@/lib/supabaseHelpers";

// Minimum width/height (px) we consider acceptable for AI recreation
export const LOW_RES_THRESHOLD = 1000;

export function getImageDimensions(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
}

export function isLowRes(w: number, h: number) {
  return Math.min(w, h) < LOW_RES_THRESHOLD;
}

export function useUpload() {
  const [preview,    setPreview]    = useState<string | null>(null);
  const [uploadedUrl, setUploaded]  = useState<string | null>(null);
  const [uploading,  setUploading]  = useState(false);
  const [uploadErr,  setUploadErr]  = useState("");
  const [lowResWarning, setLowResWarning] = useState<string>("");

  const loadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadErr("Please upload an image file.");
      return;
    }
    setUploadErr("");
    setLowResWarning("");

    // Show instant preview via FileReader
    const reader = new FileReader();
    reader.onload = async e => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      try {
        const { w, h } = await getImageDimensions(dataUrl);
        if (isLowRes(w, h)) {
          setLowResWarning(
            `Low-resolution photo (${w}×${h}px). For best results, upload an image at least ${LOW_RES_THRESHOLD}×${LOW_RES_THRESHOLD}px. Recreations may appear blurry or less detailed.`
          );
        }
      } catch {/* ignore */}
    };
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
    setLowResWarning("");
  }, []);

  return { preview, uploadedUrl, uploading, uploadErr, lowResWarning, loadFile, clearPhoto };
}
