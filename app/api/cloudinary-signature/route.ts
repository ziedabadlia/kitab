import { auth } from "@/features/auth/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.CLOUDINARY_VIDEO_UPLOAD_PRESET,
  });
}
