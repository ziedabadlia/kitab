import { auth } from "@/features/auth/auth";
import BookSpotlight from "@/features/userPlatform/components/BookSpotlight";
import { db } from "@/lib/db";

const HomePage = async () => {
  const session = await auth();

  // Fetch the latest book to feature in the spotlight
  // We include categories because our UI needs to show the genre
  const featuredBook = await db.book.findFirst({
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className='flex flex-col gap-20 pb-10'>
      {featuredBook && <BookSpotlight book={featuredBook} session={session} />}

      {/* Next: Popular Books Grid */}
    </div>
  );
};

export default HomePage;
