"use client";

import AuthCard from "@/features/auth/components/AuthCard";
import { useVerification } from "@/features/auth/hooks/useVerification";
import Link from "next/link";
import { BeatLoader } from "react-spinners";

export default function NewVerificationContent() {
  const { success, error, loading, description } = useVerification();

  return (
    <AuthCard title='Email Verification' description={description}>
      <div className='flex flex-col items-center justify-center w-full py-6'>
        {loading && <BeatLoader color='#E7C9A5' />}

        {success && (
          <div className='w-full p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center'>
            {success}
          </div>
        )}

        {error && (
          <div className='w-full p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center'>
            {error}
          </div>
        )}

        <div className='mt-8 w-full'>
          <Link
            href='/login'
            className='flex items-center justify-center w-full p-3 rounded-md bg-[#E7C9A5] text-[#12141D] font-semibold hover:bg-[#E7C9A5]/90 transition-all'
          >
            Back to Login
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
