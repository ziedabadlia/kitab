import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Helper to wrap content in the BookWise Template
const getBookWiseTemplate = (
  title: string,
  content: string,
  buttonText: string,
  buttonLink: string,
) => {
  return `
    <div style="background-color: #05070A; color: #FFFFFF; font-family: sans-serif; padding: 40px; max-width: 600px; margin: auto; border-radius: 8px;">
      <div style="margin-bottom: 30px;">
        <img src="https://res.cloudinary.com/dt7w60zoz/image/upload/v1769089532/logo_l5yyom.png" alt="BookWise" style="height: 40px;" />
      </div>
      <hr style="border: 0; border-top: 1px solid #1E293B; margin-bottom: 30px;" />
      
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">${title}</h1>
      
      <div style="color: #94A3B8; line-height: 1.6; margin-bottom: 30px;">
        ${content}
      </div>

      <a href="${buttonLink}" style="background-color: #E7C9A5; color: #05070A; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
        ${buttonText}
      </a>

      <p style="margin-top: 40px; color: #64748B; font-size: 14px;">
        Happy reading,<br />
        The BookWise Team
      </p>
    </div>
  `;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXTAUTH_URL}/new-verification?token=${token}`;

  const html = getBookWiseTemplate(
    "Welcome to BookWise, Your Reading Companion!",
    "We're excited to have you join our community of book enthusiasts. Please verify your email to start borrowing books with ease.",
    "Verify Email Address",
    confirmLink,
  );

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"BookWise" <noreply@bookwise.com>',
    to: email,
    subject: "Verify your email",
    html,
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/new-password?token=${token}`;

  const html = getBookWiseTemplate(
    "Reset Your Password",
    "We received a request to reset your password. If you didn't make this request, you can safely ignore this email. Otherwise, click the button below.",
    "Reset Password",
    resetLink,
  );

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"BookWise" <noreply@bookwise.com>',
    to: email,
    subject: "Reset your password",
    html,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const html = getBookWiseTemplate(
    "Secure Your Account",
    `Your security is important to us. Use the code below to complete your login. It will expire in 10 minutes. <br/><br/> <strong style="font-size: 24px; color: #E7C9A5;">${token}</strong>`,
    "Login to BookWise",
    `${process.env.NEXTAUTH_URL}/login`,
  );

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"BookWise" <noreply@bookwise.com>',
    to: email,
    subject: "2FA Code",
    html,
  });
};
