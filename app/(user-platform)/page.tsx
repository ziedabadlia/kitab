import { auth } from "@/features/auth/auth";
import BookSpotlight from "@/features/BorrowRequest/components/BookSpotlight";
import { getPopularBooks } from "@/features/home/lib/popularBooks";
import PopularBooks, {
  PopularBooksSkeleton,
} from "@/features/home/sections/PopularBooks";
import { db } from "@/lib/db";
import { Suspense } from "react";

const HomePage = async () => {
  const session = await auth();

  const [featuredBook, student] = await Promise.all([
    db.book.findFirst({
      include: { categories: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
    }),
    session?.user?.id
      ? db.student.findUnique({
          where: { userId: session.user.id },
          select: { id: true },
        })
      : null,
  ]);

  const existingRequest =
    featuredBook && student
      ? await db.borrowing.findFirst({
          where: {
            studentId: student.id,
            bookId: featuredBook.id,
            status: { notIn: ["RETURNED", "REJECTED", "CANCELLED", "LOST"] },
          },
          select: { id: true },
        })
      : null;

  return (
    <div className='flex flex-col gap-20 pb-10'>
      {featuredBook && (
        <BookSpotlight
          book={featuredBook}
          status={session?.user.status!}
          role={session?.user.role}
          hasExistingRequest={!!existingRequest}
          showBookLink
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
