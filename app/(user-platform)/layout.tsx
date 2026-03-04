import { auth } from "@/features/auth/auth";
import Navbar from "@/components/UserPlatformNavbar";
import { redirect } from "next/navigation";
import Image from "next/image";

import noise from "@/assets/images/noise.webp";
import Announcement from "@/components/Announcement";
import { getNotifications } from "@/features/notifications/actions/notifications";
import { DEFAULT_ADMIN_LOGIN_REDIRECT } from "@/routes";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session?.user?.role === "ADMIN") {
    redirect(DEFAULT_ADMIN_LOGIN_REDIRECT);
  }

  const isRestricted =
    session.user.role === "STUDENT" && session.user.status !== "ACCEPTED";

  const notifications = await getNotifications();

  return (
    <main className='kitab-bg flex flex-col min-h-screen'>
      <Image
        fill
        alt='noise'
        src={noise}
        className='object-cover z-10 opacity-7 pointer-events-none'
        priority
      />
      <div className='relative z-10'>
        <Navbar
          userName={session.user.name}
          profilePictureUrl={session.user.profilePictureUrl!}
          initialNotifications={notifications}
        />
        <div className='mt-24 px-5 md:px-10 lg:px-20'>
          {isRestricted && (
            <Announcement
              variant='warning'
              message='Your account is currently under review. You have limited access until an administrator approves your request.'
            />
          )}
          {children}
        </div>
      </div>
    </main>
  );
}
