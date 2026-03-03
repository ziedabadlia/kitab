import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { differenceInDays, startOfDay } from "date-fns";
import {
  sendDueSoonEmail,
  sendOverdueEmail,
} from "@/lib/emails/getKitabTemplate/senders/borrowing";
import { createNotification } from "@/features/notifications/actions/notifications";

// Vercel cron security check
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const today = startOfDay(new Date());

    // Fetch all active BORROWED records with student + book info
    const activeBorrowings = await db.borrowing.findMany({
      where: { status: "BORROWED", dueDate: { not: null } },
      include: {
        book: { select: { title: true } },
        student: {
          include: {
            user: { select: { email: true, fullName: true } },
          },
        },
      },
    });

    const dueSoonResults = { sent: 0, errors: 0 };
    const overdueResults = { sent: 0, errors: 0 };

    await Promise.allSettled(
      activeBorrowings.map(async (borrowing) => {
        const dueDate = startOfDay(borrowing.dueDate!);
        const daysLeft = differenceInDays(dueDate, today);

        const { email, fullName } = borrowing.student.user;
        const bookTitle = borrowing.book.title;

        if (daysLeft >= 1 && daysLeft <= 3) {
          // Due soon — send reminder (1, 2, or 3 days left)
          try {
            const dayLabel = `${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
            await Promise.allSettled([
              sendDueSoonEmail(
                email,
                fullName,
                bookTitle,
                borrowing.dueDate!,
                daysLeft,
              ),
              createNotification(
                borrowing.studentId,
                `Reminder: "${bookTitle}" is due in ${dayLabel}. Please return it on time.`,
              ),
            ]);
            dueSoonResults.sent++;
          } catch (err) {
            console.error(
              `Due-soon notification failed for borrowing ${borrowing.id}:`,
              err,
            );
            dueSoonResults.errors++;
          }
        } else if (daysLeft < 0) {
          // Overdue — notify student (status change is handled by admin)
          const daysOverdue = Math.abs(daysLeft);
          try {
            const overdueLabel = `${daysOverdue} day${daysOverdue === 1 ? "" : "s"}`;
            await Promise.allSettled([
              sendOverdueEmail(
                email,
                fullName,
                bookTitle,
                borrowing.dueDate!,
                daysOverdue,
              ),
              createNotification(
                borrowing.studentId,
                `Your borrowed book "${bookTitle}" is ${overdueLabel} overdue. Please return it immediately.`,
              ),
            ]);
            overdueResults.sent++;
          } catch (err) {
            console.error(
              `Overdue notification failed for borrowing ${borrowing.id}:`,
              err,
            );
            overdueResults.errors++;
          }
        }
      }),
    );

    return NextResponse.json({
      success: true,
      dueSoon: dueSoonResults,
      overdue: overdueResults,
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
