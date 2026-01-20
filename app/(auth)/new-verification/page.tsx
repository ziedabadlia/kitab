"use client";
import AuthCard from "@/features/auth/components/AuthCard";
import { useVerification } from "@/features/auth/hooks/useVerification";
import Link from "next/link";
import { BeatLoader } from "react-spinners";

export default function NewVerificationPage() {
  const { success, error, loading, description } = useVerification();

  return (
    <AuthCard
      title='Email Verification'
      description={description} // Just pass the value from the hook
    >
      <div className='flex flex-col items-center justify-center w-full py-6'>
        {loading && <BeatLoader color='#ffffff' />}

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
            className='flex items-center justify-center w-full p-3 rounded-md bg-white text-[#12141D] font-semibold hover:bg-[#D6E0FF] transition-all'
          >
            Back to Login
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
