import { auth } from "@/features/auth/auth";
import BookSpotlight from "@/components/BookSpotlight";
import { getPopularBooks } from "@/features/home/lib/popularBooks";
import PopularBooks, {
  PopularBooksSkeleton,
} from "@/features/home/sections/PopularBooks";
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
      {featuredBook && (
        <BookSpotlight
          book={featuredBook}
          status={session?.user.status!}
          role={session?.user.role}
        />
      )}
      <Suspense fallback={<PopularBooksSkeleton />}>
        <PopularBooksList />
      </Suspense>
    </div>
  );
};

export default HomePage;

const PopularBooksList = async () => {
  const books = await getPopularBooks();
  const serializedBooks = JSON.parse(JSON.stringify(books));
  return <PopularBooks books={serializedBooks} />;
};
