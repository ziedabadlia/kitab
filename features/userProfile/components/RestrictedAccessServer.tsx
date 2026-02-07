import { ShieldAlert, Lock } from "lucide-react";

interface RestrictedAccessProps {
  status: string;
  userEmail?: string;
  userName?: string;
}

export default function RestrictedAccess({
  status,
  userEmail,
  userName,
}: RestrictedAccessProps) {
  const getStatusMessage = () => {
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

  // Create email mailto link with pre-filled subject and body
  const supportEmail = "kitab.support@gmail.com";
  const emailSubject = encodeURIComponent(
    "Account Status Issue - Access Restricted",
  );
  const emailBody = encodeURIComponent(
    `Hello Kitab Support Team,

I am contacting you regarding my account access issue.

Account Details:
- Name: ${userName || "N/A"}
- Email: ${userEmail || "N/A"}
- Current Status: ${status}

Issue:
I am unable to access my profile page due to my account status. Please review my account and help me resolve this issue.

Thank you for your assistance.

Best regards,
${userName || "Student"}`,
  );

  const mailtoLink = `mailto:${supportEmail}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <main className='container mx-auto px-4 py-10'>
      <div className='flex items-center justify-center min-h-[80vh]'>
        <div className='max-w-md w-full'>
          {/* Restricted Access Card */}
          <div className='bg-[#12141D] rounded-3xl p-8 border border-red-900/30 shadow-xl'>
            <div className='flex flex-col items-center text-center space-y-6'>
              {/* Icon */}
              <div className='w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center'>
                <ShieldAlert className='w-10 h-10 text-red-400' />
              </div>

              {/* Heading */}
              <div className='space-y-2'>
                <h2 className='text-2xl font-bold text-white tracking-tight'>
                  Access Restricted
                </h2>
                <p className='text-slate-400 text-sm'>
                  This page is not accessible with your current account status
                </p>
              </div>

              {/* Status Badge */}
              <div className='px-6 py-3 rounded-full bg-red-500/10 border border-red-500/30'>
                <div className='flex items-center gap-2'>
                  <Lock className='w-4 h-4 text-red-400' />
                  <span className='text-red-400 text-sm font-bold uppercase tracking-wider'>
                    {status} Account
                  </span>
                </div>
              </div>

              {/* Information */}
              <div className='bg-slate-900/50 rounded-xl p-4 border border-slate-800 w-full'>
                <p className='text-slate-300 text-sm leading-relaxed'>
                  Your account status is currently set to{" "}
                  <span className='text-red-400 font-semibold'>{status}</span>.
                  Only accounts with{" "}
                  <span className='text-emerald-400 font-semibold'>
                    ACCEPTED
                  </span>{" "}
                  status can access the profile page and library features.
                </p>
              </div>

              {/* Status-specific message */}
              <div className='bg-slate-900/30 rounded-lg p-3 border border-slate-800/50 w-full'>
                <p className='text-slate-400 text-xs'>{getStatusMessage()}</p>
              </div>

              {/* Support Email Info */}
              <div className='bg-[#E7C9A5]/5 border border-[#E7C9A5]/20 rounded-lg p-3 w-full'>
                <p className='text-slate-400 text-xs'>
                  💌 Support Email:{" "}
                  <span className='text-[#E7C9A5] font-medium'>
                    {supportEmail}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className='flex flex-col sm:flex-row gap-3 w-full pt-2'>
                <a
                  href='/'
                  className='flex-1 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white text-sm font-medium transition-colors text-center'
                >
                  Go Home
                </a>
                <a
                  href={mailtoLink}
                  className='flex-1 px-6 py-2.5 bg-[#E7C9A5] hover:bg-[#d4b592] rounded-lg text-[#12141D] text-sm font-bold transition-colors text-center'
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
