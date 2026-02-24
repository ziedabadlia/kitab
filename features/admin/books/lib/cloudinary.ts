import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const dataURI = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "books/covers",
    resource_type: "image",
    colors: true,
    transformation: [
      { width: 800, height: 1200, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });

  return {
    url: result.secure_url,
    color: result.colors?.[0]?.[0] || result.predominant?.color || "#010101",
  };
}

export async function uploadVideo(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const dataURI = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "books/videos",
    resource_type: "video",
    transformation: [{ quality: "auto" }],
  });

  return result.secure_url;
}

export async function deleteMedia(
  url: string,
  resourceType: "image" | "video" = "image",
) {
  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1].split(".")[0];
    const folder = parts.slice(-3, -1).join("/");
    const publicId = `${folder}/${fileName}`;

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
}
