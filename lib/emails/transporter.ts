import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const FROM = process.env.SMTP_FROM || '"KITAB" <noreply@kitab.com>';
export const APP_URL =
  process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "";

export const getKitabTemplate = (
  title: string,
  content: string,
  buttonText: string,
  buttonLink: string,
) => `
  <div style="background-color: #05070A; color: #FFFFFF; font-family: sans-serif; padding: 40px; max-width: 600px; margin: auto; border-radius: 8px;">
    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
      <tr>
        <td style="vertical-align: middle;">
          <img 
            src="https://res.cloudinary.com/dt7w60zoz/image/upload/v1769089532/logo_l5yyom.png" 
            alt="Logo" 
            style="height: 40px; border: none; outline: none; text-decoration: none; display: block;" 
          />
        </td>
        <td style="vertical-align: middle; padding-left: 12px;">
          <span style="font-size: 24px; font-weight: bold; color: #FFFFFF; font-family: sans-serif; letter-spacing: 0.5px;">
            KITAB
          </span>
        </td>
      </tr>
    </table>

    <hr style="border: 0; border-top: 1px solid #1E293B; margin-bottom: 30px;" />

    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #FFFFFF;">${title}</h1>

    <div style="color: #94A3B8; line-height: 1.6; margin-bottom: 30px;">
      ${content}
    </div>

    <a href="${buttonLink}" style="background-color: #E7C9A5; color: #05070A; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
      ${buttonText}
    </a>

    <p style="margin-top: 40px; color: #64748B; font-size: 14px;">
      Happy reading,<br />
      The KITAB Team
    </p>
  </div>
`;
