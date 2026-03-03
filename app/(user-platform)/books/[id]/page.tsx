import { db } from "@/lib/db";
import { auth } from "@/features/auth/auth";
import { redirect, notFound } from "next/navigation";
import BookCover from "@/components/BookCover";
import BookLink from "@/components/BookLink";
import BookSpotlight from "@/features/BorrowRequest/components/BookSpotlight";
import { getBookReviews } from "@/features/userProfile/actions/reviews";
import BookReviews from "@/features/userProfile/components/Reviews/Bookreviews";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const [book, student] = await Promise.all([
    db.book.findUnique({
      where: { id },
      include: { categories: { include: { category: true } } },
    }),
    db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    }),
  ]);

  if (!book) notFound();

  // Run remaining queries in parallel
  const categoryId = book.categories?.[0]?.categoryId;

  const [existingRequest, similarBooks, reviewsData] = await Promise.all([
    student
      ? db.borrowing.findFirst({
          where: {
            studentId: student.id,
            bookId: book.id,
            status: { notIn: ["RETURNED", "REJECTED", "CANCELLED", "LOST"] },
          },
          select: { id: true },
        })
      : null,

    categoryId
      ? db.book.findMany({
          where: {
            categories: { some: { categoryId } },
            id: { not: book.id },
          },
          take: 6,
        })
      : [],

    getBookReviews(book.id),
  ]);

  return (
    <div className='container mx-auto px-5 md:px-10 lg:px-20 pb-20'>
      {/* Hero Spotlight */}
      <BookSpotlight
        book={book}
        status={session.user.status}
        role={session.user.role}
        hasExistingRequest={!!existingRequest}
      />

      {/* Summary, Video, and Similar Books */}
      <div className='mt-20 flex flex-col lg:flex-row gap-16'>
        {/* LEFT: Summary & Video */}
        <div className='flex-[1.5] space-y-12'>
          {book.videoUrl && (
            <section>
              <h2 className='text-2xl font-bold text-white mb-6'>
                Video Preview
              </h2>
              <div className='relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl'>
                <video
                  src={book.videoUrl}
                  controls
                  className='w-full h-full object-cover'
                />
              </div>
            </section>
          )}

          <section>
            <h2 className='text-2xl font-bold text-white mb-6'>Summary</h2>
            <div className='text-slate-400 leading-relaxed text-lg space-y-6'>
              {book.description?.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <BookReviews bookId={book.id} initialData={reviewsData} />
        </div>

        {/* RIGHT: Similar Books */}
        <aside className='flex-1'>
          <h2 className='text-2xl font-bold text-white mb-8'>
            More similar books
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-6'>
            {similarBooks.map((similarBook) => (
              <div key={similarBook.id} className='flex justify-center'>
                <BookLink id={similarBook.id} title={similarBook.title}>
                  <BookCover
                    coverImage={similarBook.coverImageUrl!}
                    coverColor={similarBook.coverColor}
                    variant='regular'
                    className='w-full max-w-[120px] aspect-2/3'
                  />
                </BookLink>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
