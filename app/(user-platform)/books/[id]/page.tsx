import { db } from "@/lib/db";
import { auth } from "@/features/auth/auth";
import { redirect, notFound } from "next/navigation";
import BookSpotlight from "@/components/BookSpotlight";
import BookCover from "@/components/BookCover";
import BookLink from "@/components/BookLink";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const book = await db.book.findUnique({
    where: { id },
    include: { categories: { include: { category: true } } },
  });

  if (!book) notFound();

  // Fetch similar books based on the first category ID
  const categoryId = book.categories?.[0]?.categoryId;
  const similarBooks = categoryId
    ? await db.book.findMany({
        where: {
          categories: { some: { categoryId } },
          id: { not: book.id }, // Don't include the current book
        },
        take: 6,
      })
    : [];

  return (
    <div className='container mx-auto px-5 md:px-10 lg:px-20 pb-20'>
      {/* 1. TOP SECTION: Hero Spotlight */}
      <BookSpotlight
        book={book}
        status={session.user.status}
        role={session.user.role}
      />

      {/* 2. BOTTOM SECTION: Summary, Video, and Similar Books */}
      <div className='mt-20 flex flex-col lg:flex-row gap-16'>
        {/* LEFT: Summary & Conditional Video */}
        <div className='flex-[1.5] space-y-12'>
          {book.videoUrl && (
            <section>
              <h2 className='text-2xl font-bold text-white mb-6'>
                Video Preview
              </h2>
              <div className='relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl'>
                {/* Using a standard video tag or a dedicated VideoPlayer component */}
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
              {/* Split by newline to render paragraphs */}
              {book.description?.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {/* Video renders only if bookVideoUrl is a string */}
        </div>

        {/* RIGHT: More Similar Books using BookCover */}
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
