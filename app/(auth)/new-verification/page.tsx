import NewVerificationContent from "@/features/auth/components/NewVerificationContent";
import VerificationSkeleton from "@/features/auth/components/VerificationSkeleton";
import { Suspense } from "react";

export default function NewVerificationPage() {
  return (
    <Suspense fallback={<VerificationSkeleton />}>
      <NewVerificationContent />
    </Suspense>
  );
}
