// app/profile/page.tsx (Server Component)
import { auth } from "@/features/auth/auth";
import { redirect } from "next/navigation";
import { UserStatus } from "@prisma/client";
import RestrictedAccess from "./RestrictedAccessServer";
import ProfilePageClient from "./ProfilePageClient";

export default async function ProfilePage() {
  const session = await auth();

  // Redirect to login if no session
  if (!session) redirect("/login");

  // Check if user status is ACCEPTED
  if (session.user.status !== UserStatus.ACCEPTED) {
    return (
      <RestrictedAccess
        status={session.user.status}
        userEmail={session.user.email || undefined}
        userName={session.user.name || undefined}
      />
    );
  }

  // Pass session data to client component
  return <ProfilePageClient />;
}
