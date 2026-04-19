import api from "./client";

export const getPresignedUrl = (
  filename: string, 
  file_type: string, 
  product_id?: string, 
  category?: string
) => {
  return api.post("/upload/presigned-url", { 
    filename, 
    file_type,
    product_id: product_id || "new",
    category: category || "images"
  });
};

export const uploadFileToS3 = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    // No Content-Type header — must match what was signed in the presigned URL
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to S3");
  }

  return true;
};
