import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"KITAB" <noreply@yourapp.com>',
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code is: <strong>${token}</strong></p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  }/auth/new-verification?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"KITAB" <noreply@yourapp.com>',
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${confirmLink}">Verify Email</a>
      <p>Or copy and paste this link: ${confirmLink}</p>
    `,
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  }/auth/new-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Your App" <noreply@yourapp.com>',
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>Or copy and paste this link: ${resetLink}</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};
