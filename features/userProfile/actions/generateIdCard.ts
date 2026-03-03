"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import QRCode from "qrcode";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateIdCard(
  userId: string,
  data: {
    dateOfBirth: string;
    department: string;
    contactNo: string;
    address: string;
  },
) {
  try {
    // Guard: profile picture is required before generating an ID card
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { profilePictureUrl: true },
    });

    if (!user?.profilePictureUrl) {
      return {
        success: false,
        error:
          "A profile picture is required to generate your ID card. Please upload one first.",
      };
    }

    // 1. Update student metadata
    const updatedStudent = await db.student.update({
      where: { userId },
      data: {
        dateOfBirth: new Date(data.dateOfBirth),
        department: data.department,
        contactNo: data.contactNo,
        address: data.address,
      },
      include: { user: true },
    });

    const appUrl = process.env.NEXTAUTH_URL;
    const qrData = `${appUrl}/verify/${updatedStudent.studentIdNumber}`;

    const qrBuffer = await QRCode.toBuffer(qrData, {
      margin: 1,
      color: { dark: "#05070A", light: "#FFFFFF" },
    });

    // 2. Upload QR to Cloudinary
    const qrUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "KITAB/qr_codes",
            public_id: `qr_${updatedStudent.studentIdNumber}`,
          },
          (err, result) => (err ? reject(err) : resolve(result)),
        )
        .end(qrBuffer);
    });

    const qrUrl = (qrUpload as any).secure_url;

    // 3. Save QR URL as generatedIdCardUrl
    await db.student.update({
      where: { id: updatedStudent.id },
      data: { generatedIdCardUrl: qrUrl },
    });

    revalidatePath("/profile");
    return { success: true, url: qrUrl };
  } catch (error) {
    console.error("ID Generation Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate ID",
    };
  }
}
