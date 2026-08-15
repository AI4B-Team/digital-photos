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


// Large phone photos (20MB+) blow up the base64 payload sent to the AI function
// and slow the storage upload. Downscale anything oversized to a sane JPEG.
export const MAX_UPLOAD_DIMENSION = 2400;
const COMPRESS_ABOVE_BYTES = 3 * 1024 * 1024;

export async function compressImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  try {
    const dataUrl: string = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataUrl; });

    const biggest = Math.max(img.naturalWidth, img.naturalHeight);
    const needsResize = biggest > MAX_UPLOAD_DIMENSION;
    if (!needsResize && file.size <= COMPRESS_ABOVE_BYTES) return file;

    const scale = needsResize ? MAX_UPLOAD_DIMENSION / biggest : 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob: Blob | null = await new Promise(res => canvas.toBlob(res, "image/jpeg", 0.9));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
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

    const original = file;
    file = await compressImage(file);

    // Show instant preview via FileReader
    const reader = new FileReader();
    reader.onload = async e => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      try {
        const { w, h } = await getImageDimensions(dataUrl);
        void original;
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
