"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/api/upload";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  label?: string;
  maxImages?: number;
}

export default function ImageUpload({
  value = [],
  onChange,
  onRemove,
  label = "Images",
  maxImages = 5
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (value.length + newUrls.length >= maxImages) break;
        const url = await uploadImage(files[i]);
        newUrls.push(url);
      }
      onChange([...value, ...newUrls]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload one or more images");
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-500">{value.length} / {maxImages}</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {value.map((url) => (
          <div key={url} className="relative aspect-square rounded-md overflow-hidden border">
            <div className="absolute top-1 right-1 z-10">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
              >
                <X size={14} />
              </button>
            </div>
            <img
              src={url}
              alt="Product"
              className="object-cover w-full h-full"
            />
          </div>
        ))}
        
        {value.length < maxImages && (
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition bg-gray-50">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" size={24} />
            ) : (
              <>
                <Upload className="text-gray-400" size={24} />
                <span className="text-xs text-gray-500 mt-2">Upload</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onUpload}
              disabled={loading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
