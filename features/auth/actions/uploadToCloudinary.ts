"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  [key: string]: any;
}

export async function uploadToCloudinary(
  fileToUpload: File,
): Promise<CloudinaryResponse> {
  const arrayBuffer = await fileToUpload.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // Return the Promise typed with our interface
  return new Promise<CloudinaryResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "id_cards",
          access_mode: "authenticated",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        },
      )
      .end(buffer);
  });
}
