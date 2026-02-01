import { auth } from "@/features/auth/auth";
import BookSpotlight from "@/features/userPlatform/components/BookSpotlight";
import PopularBooks from "@/features/userPlatform/components/PopularBooks";
import PopularBooksSkeleton from "@/features/userPlatform/components/PopularBooksSkeleton";
import { getPopularBooks } from "@/features/userPlatform/lib/popularBooks";
import { db } from "@/lib/db";
import { Suspense } from "react";

const HomePage = async () => {
  const session = await auth();

  const featuredBook = await db.book.findFirst({
    include: {
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className='flex flex-col gap-20 pb-10'>
      {featuredBook && <BookSpotlight book={featuredBook} session={session} />}
      <Suspense fallback={<PopularBooksSkeleton />}>
        <PopularBooksList />
      </Suspense>
    </div>
  );
};
export default HomePage;

const PopularBooksList = async () => {
  const books = await getPopularBooks();
  return <PopularBooks books={books} />;
};
