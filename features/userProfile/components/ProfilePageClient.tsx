"use client";

import { useProfile } from "../hooks/useProfile";
import ProfileInfo from "./ProfileInfo";
import BorrowedBooks from "./BorrowedBooks";
import { Loader2 } from "lucide-react";

export default function ProfilePageClient() {
  const { data, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className='flex h-[80vh] items-center justify-center'>
        <Loader2 className='w-10 h-10 text-[#E7C9A5] animate-spin' />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='text-center py-20'>
        <h2 className='text-white text-2xl font-bold'>Something went wrong.</h2>
        <p className='text-slate-400'>
          Could not retrieve your library profile.
        </p>
      </div>
    );
  }

  return (
    <main className='container mx-auto px-4 py-10'>
      <div className='flex flex-col lg:flex-row gap-10 items-start'>
        <section className='w-full lg:w-[400px] lg:sticky lg:top-24'>
          <ProfileInfo profile={data.profile} />
        </section>
        <section className='flex-1 w-full'>
          <BorrowedBooks books={data.borrowedBooks} />
        </section>
      </div>
    </main>
  );
}
