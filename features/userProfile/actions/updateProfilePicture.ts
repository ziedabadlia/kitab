"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateProfilePicture(userId: string, file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "profile_pictures", width: 400, height: 400, crop: "fill" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    await db.user.update({
      where: { id: userId },
      data: { profilePictureUrl: (result as any).secure_url },
    });

    revalidatePath("/profile");
    return { success: true, url: (result as any).secure_url };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload profile picture" };
  }
}
