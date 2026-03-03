"use server";

import { db } from "@/lib/db";
import { auth } from "@/features/auth/auth";
import { revalidatePath } from "next/cache";
import { NotificationItem } from "../types";

// Internal helper — called from other server actions, never directly from client
export async function createNotification(studentId: string, message: string) {
  try {
    await db.notification.create({ data: { studentId, message } });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!student) return [];

  const notifications = await db.notification.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return notifications.map((n) => ({
    id: n.id,
    message: n.message,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  }));
}

export async function markNotificationRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!student) return;

  await db.notification.updateMany({
    where: { id: notificationId, studentId: student.id },
    data: { isRead: true },
  });

  revalidatePath("/");
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) return;

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!student) return;

  await db.notification.updateMany({
    where: { studentId: student.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/");
}
