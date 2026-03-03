import {
  APP_URL,
  FROM,
  getKitabTemplate,
  transporter,
} from "../../transporter";

export const sendApprovalEmail = async (email: string, studentName: string) => {
  const html = getKitabTemplate(
    "Your KITAB Account Has Been Approved!",
    `Hi ${studentName},<br/><br/>
    Congratulations! Your KITAB account has been approved. You can now browse our library,
    borrow books, and enjoy all the features of your new account.`,
    "Log in to KITAB",
    `${APP_URL}/sign-in`,
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Your KITAB Account Has Been Approved!",
    html,
  });
};

export const sendRejectionEmail = async (
  email: string,
  studentName: string,
) => {
  const html = getKitabTemplate(
    "Update on Your KITAB Application",
    `Hi ${studentName},<br/><br/>
    Thank you for applying for a KITAB account. Unfortunately, we were unable to verify
    your university ID card and your application has not been approved at this time.<br/><br/>
    If you believe this is a mistake or would like to reapply with updated documents,
    please contact our support team.`,
    "Contact Support",
    `${APP_URL}/support`,
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Update on Your KITAB Application",
    html,
  });
};
