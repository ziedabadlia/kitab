"use server";
import { v2 as cloudinary } from "cloudinary";

export async function getPrivateImageUrl(publicId: string) {
  try {
    const signedUrl = cloudinary.url(publicId, {
      sign_url: true,
      type: "authenticated",
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    });

    return signedUrl;
  } catch (error) {
    console.error("CLOUDINARY_SIGN_ERROR:", error);
    return null;
  }
}
