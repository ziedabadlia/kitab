import { db } from "@/lib/db";
import { auth } from "@/features/auth/auth";
import { redirect, notFound } from "next/navigation";
import BookCover from "@/components/BookCover";
import BookLink from "@/components/BookLink";
import { getBookReviews } from "@/features/userProfile/actions/reviews";
import BookReviews from "@/features/userProfile/components/Reviews/Bookreviews";
import BookSpotlight from "@/features/BorrowRequest/components/BookSpotlight";

export const revalidate = 300;

export async function generateStaticParams() {
  const books = await db.book.findMany({ select: { id: true } });
  return books.map((book) => ({ id: book.id }));
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const [book, reviewsData] = await Promise.all([
    db.book.findUnique({
      where: { id },
      include: { categories: { include: { category: true } } },
    }),
    getBookReviews(id),
  ]);

  if (!book) notFound();

  const categoryId = book.categories?.[0]?.categoryId;
  const similarBooks = categoryId
    ? await db.book.findMany({
        where: {
          categories: { some: { categoryId } },
          id: { not: book.id },
        },
        take: 6,
      })
    : [];

  return (
    <div className='container mx-auto px-5 md:px-10 lg:px-20 pb-20'>
      <BookSpotlight
        book={book}
        status={session.user.status}
        role={session.user.role}
        showBookLink={false}
      />

      <div className='mt-20 flex flex-col lg:flex-row gap-16'>
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

          <BookReviews bookId={book.id} initialData={reviewsData} />
        </div>

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
