export const SUPPORT_EMAIL = "kitab.support@gmail.com";

/**
 * Returns a user-friendly message based on the account status
 */
export const getAccountStatusMessage = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "⏳ Your account is pending approval. You'll receive an email once activated.";
    case "SUSPENDED":
      return "⚠️ Your account has been suspended. Please contact the library administrator.";
    case "REJECTED":
      return "❌ Your account registration was not approved. Please contact support for details.";
    default:
      return "📧 Please contact your library administrator for assistance.";
  }
};

/**
 * Generates a pre-filled mailto link for support requests
 */
export const generateSupportMailto = (
  status: string,
  userName?: string,
  userEmail?: string,
) => {
  const subject = encodeURIComponent(
    "Account Status Issue - Access Restricted",
  );
  const body = encodeURIComponent(
    `Hello Kitab Support Team,\n\n` +
      `I am contacting you regarding my account access issue.\n\n` +
      `Account Details:\n` +
      `- Name: ${userName || "N/A"}\n` +
      `- Email: ${userEmail || "N/A"}\n` +
      `- Current Status: ${status}\n\n` +
      `Issue:\n` +
      `I am unable to access my profile page due to my account status. Please review my account and help me resolve this issue.\n\n` +
      `Thank you for your assistance.\n\n` +
      `Best regards,\n` +
      `${userName || "Student"}`,
  );

  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
};
