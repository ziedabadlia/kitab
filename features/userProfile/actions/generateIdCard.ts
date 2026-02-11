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
    // 1. Update student metadata
    const updatedStudent = await db.student.update({
      where: { userId: userId },
      data: {
        dateOfBirth: new Date(data.dateOfBirth),
        department: data.department,
        contactNo: data.contactNo,
        address: data.address,
      },
      include: { user: true },
    });

    const host = process.env.VERCEL_URL || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const qrData = `${baseUrl}/verify/${updatedStudent.studentIdNumber}`;

    const qrBuffer = await QRCode.toBuffer(qrData, {
      margin: 1,
      color: { dark: "#05070A", light: "#FFFFFF" },
    });

    // 3. Upload ONLY the QR to Cloudinary
    const qrUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "bookwise/qr_codes",
            public_id: `qr_${updatedStudent.studentIdNumber}`,
          },
          (err, result) => (err ? reject(err) : resolve(result)),
        )
        .end(qrBuffer);
    });

    const qrUrl = (qrUpload as any).secure_url;

    // 4. Save the QR URL as the 'generatedIdCardUrl'
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
