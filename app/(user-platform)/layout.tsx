import { auth } from "@/features/auth/auth";
import Navbar from "@/components/UserPlatformNavbar";
import { redirect } from "next/navigation";
import Image from "next/image";

import noise from "@/assets/images/noise.webp";
import Announcement from "@/components/Announcement";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  const isRestricted =
    session.user.role === "STUDENT" && session.user.status !== "ACCEPTED";

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
        <Navbar userName={session.user.name} />
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
