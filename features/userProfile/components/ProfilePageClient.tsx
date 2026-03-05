"use client";

import { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import ProfileInfo from "./ProfileInfo";
import BorrowedBooks from "./BorrowedBooks";
import GenerateCardModal from "./GenerateCardModal";
import ProfileInfoSkeleton from "./skeletons/ProfileInfoSkeleton";
import BorrowedBooksSkeleton from "./skeletons/BorrowedBooksSkeleton";

export default function ProfilePageClient() {
  const { data, isLoading, isError } = useProfile();
  const [showCardModal, setShowCardModal] = useState(false);

  if (isError) {
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
          {isLoading || !data?.profile ? (
            <ProfileInfoSkeleton />
          ) : (
            <>
              <ProfileInfo
                profile={data.profile}
                onOpenCardModal={() => setShowCardModal(true)}
              />
              <GenerateCardModal
                profile={data.profile}
                isOpen={showCardModal}
                onClose={() => setShowCardModal(false)}
              />
            </>
          )}
        </section>

        <section className='flex-1 w-full'>
          {isLoading || !data?.borrowedBooks ? (
            <BorrowedBooksSkeleton />
          ) : (
            <BorrowedBooks books={data.borrowedBooks} />
          )}
        </section>
      </div>
    </main>
  );
}
