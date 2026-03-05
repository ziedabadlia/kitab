// app/profile/page.tsx (Server Component)
import { auth } from "@/features/auth/auth";
import { redirect } from "next/navigation";
import { UserStatus } from "@prisma/client";
import RestrictedAccess from "./RestrictedAccessServer";
import ProfilePageClient from "./ProfilePageClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) redirect("/login");

  if (session.user.status !== UserStatus.ACCEPTED) {
    return (
      <RestrictedAccess
        status={session.user.status}
        userEmail={session.user.email || undefined}
        userName={session.user.name || undefined}
      />
    );
  }

  return <ProfilePageClient />;
}
