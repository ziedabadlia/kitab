import { auth } from "@/features/auth/auth";
import Navbar from "@/features/userPlatform/components/UserPlatformNavbar";
import { redirect } from "next/navigation";
import Image from "next/image";

import noise from "@/assets/images/noise.webp";
import Announcement from "@/components/Announcement";
import { UserStatus } from "@prisma/client";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isSuspended = session!.user.status === UserStatus.SUSPENDED;

  if (!session) redirect("/login");

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
        <Navbar session={session} />
        <div className='mt-24 px-5 md:px-10 lg:px-20'>
          {isSuspended && (
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
