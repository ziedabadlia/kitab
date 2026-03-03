import { format } from "date-fns";
// lib/emails/senders/borrowing.ts
import {
  transporter,
  FROM,
  APP_URL,
  getKitabTemplate,
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
