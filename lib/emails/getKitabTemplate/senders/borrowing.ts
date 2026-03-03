import { format } from "date-fns";
import {
  APP_URL,
  FROM,
  getKitabTemplate,
  transporter,
} from "../../transporter";

export const sendBorrowRequestApprovedEmail = async (
  email: string,
  studentName: string,
  bookTitle: string,
  bookAuthor: string,
) => {
  const html = getKitabTemplate(
    "Your Borrow Request Has Been Approved!",
    `Hi ${studentName},<br/><br/>
    Great news! Your request to borrow <strong style="color:#FFFFFF;">${bookTitle}</strong> by ${bookAuthor} has been approved.<br/><br/>
    Please visit the library to pick up your book. Once you collect it, your borrowing period and due date will be confirmed.
    <br/><br/>
    <strong style="color:#E7C9A5;">Note:</strong> If the book is not collected within 3 days, your reservation may be cancelled.`,
    "View My Requests",
    `${APP_URL}/borrowings`,
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Your Request for "${bookTitle}" Has Been Approved!`,
    html,
  });
};

export const sendBorrowConfirmationEmail = async (
  email: string,
  studentName: string,
  bookTitle: string,
  borrowedAt: Date,
  dueDate: Date,
) => {
  const fmt = (date: Date) => format(date, "MMMM d, yyyy");

  const html = getKitabTemplate(
    "You've Borrowed a Book!",
    `Hi ${studentName},<br/><br/>
    You've successfully borrowed <strong style="color:#FFFFFF;">${bookTitle}</strong>. Here are the details:
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Borrowed On: <strong style="color: #E7C9A5;">${fmt(borrowedAt)}</strong></li>
      <li>Due Date: <strong style="color: #E7C9A5;">${fmt(dueDate)}</strong></li>
    </ul>
    Enjoy your reading, and don't forget to return the book on time!`,
    "View Borrowed Books",
    `${APP_URL}/borrowings`,
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `You've Borrowed "${bookTitle}"`,
    html,
  });
};

export const sendBorrowRejectedEmail = async (
  email: string,
  studentName: string,
  bookTitle: string,
) => {
  const html = getKitabTemplate(
    "Your Borrow Request Was Not Approved",
    `Hi ${studentName},<br/><br/>
    Unfortunately, your request to borrow <strong style="color:#FFFFFF;">${bookTitle}</strong> has been rejected.<br/><br/>
    This may be due to unavailability or other library policies. You're welcome to browse our collection and submit a new request for another book.`,
    "Browse Books",
    `${APP_URL}/books`,
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Your Borrow Request for "${bookTitle}" Was Not Approved`,
    html,
  });
};

export const sendDueSoonEmail = async (
  email: string,
  studentName: string,
  bookTitle: string,
  dueDate: Date,
  daysLeft: number,
) => {
  const fmt = (date: Date) => format(date, "MMMM d, yyyy");

  const html = getKitabTemplate(
    "Your Book Is Due Soon",
    `Hi ${studentName},<br/><br/>
    This is a friendly reminder that <strong style="color:#FFFFFF;">${bookTitle}</strong> is due in
    <strong style="color:#E7C9A5;">${daysLeft} day${daysLeft === 1 ? "" : "s"}</strong>
    on <strong style="color:#E7C9A5;">${fmt(dueDate)}</strong>.<br/><br/>
    Please return it to the library on time to avoid any late penalties.`,
    "View Borrowed Books",
    `${APP_URL}/profile`,
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Reminder: "${bookTitle}" Is Due in ${daysLeft} Day${daysLeft === 1 ? "" : "s"}`,
    html,
  });
};

export const sendOverdueEmail = async (
  email: string,
  studentName: string,
  bookTitle: string,
  dueDate: Date,
  daysOverdue: number,
) => {
  const fmt = (date: Date) => format(date, "MMMM d, yyyy");

  const html = getKitabTemplate(
    "Your Book Is Overdue",
    `Hi ${studentName},<br/><br/>
    Your borrowed copy of <strong style="color:#FFFFFF;">${bookTitle}</strong> was due on
    <strong style="color:#E7C9A5;">${fmt(dueDate)}</strong> and is now
    <strong style="color:#E7C9A5;">${daysOverdue} day${daysOverdue === 1 ? "" : "s"} overdue</strong>.<br/><br/>
    Please return it to the library as soon as possible to avoid further penalties.`,
    "View Borrowed Books",
    `${APP_URL}/profile`,
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Overdue Notice: "${bookTitle}" Was Due ${daysOverdue} Day${daysOverdue === 1 ? "" : "s"} Ago`,
    html,
  });
};
