import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Calendar, FileVideo, Edit } from "lucide-react";
import BookCover from "@/components/BookCover";
import { getBookByIdAction } from "@/features/admin/booksDetails/actions/book";
import arrowLeftSvg from "@/assets/svg/admin/arrowLeft.svg";
import Image from "next/image";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBookByIdAction(id);

  if (!book) notFound();

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-8'>
      {/* Top Navigation */}
      <Link
        href='/admin/books'
        className='inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium transition-all '
      >
        {/* <ChevronLeft className='w-4 h-4 text-[#3A354E]' /> */}
        <Image src={arrowLeftSvg} height={18} width={18} alt='Go back' />
        <span className='text-[#3A354E]'>Go back</span>
      </Link>

      {/* Main Header Section */}
      <div className='flex flex-col md:flex-row gap-8 items-start'>
        <div className='w-full md:w-64 h-80 shadow-xl border border-slate-100 flex-shrink-0'>
          <BookCover
            coverImage={book.coverImageUrl || ""}
            coverColor={book.coverColor}
          />
        </div>

        <div className='flex-1 space-y-4'>
          <div className='flex items-center gap-2 text-slate-500 text-sm'>
            <span>Created at:</span>
            <Calendar className='w-4 h-4' />
            <span>{book.createdAt}</span>
          </div>

          <h1 className='text-3xl font-bold text-[#1E293B]'>{book.title}</h1>

          <p className='text-xl font-medium text-slate-600'>
            By <span className='text-slate-900'>{book.author}</span>
          </p>

          <p className='text-slate-400 font-medium'>
            {book.genre || book.department.name}
          </p>

          <Link
            href={`/admin/books/edit/${book.id}`}
            className='inline-flex items-center justify-center gap-2 w-full md:w-80 px-6 py-3 bg-[#253585] text-white rounded-xl font-semibold transition-all'
          >
            <Edit className='w-5 h-5' />
            Edit Book
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8'>
        {/* Summary Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-bold text-[#1E293B]'>Summary</h2>
          <div className='text-slate-500 leading-relaxed whitespace-pre-wrap'>
            {book.description || "No summary available for this book."}
          </div>
        </div>

        {/* Video Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-bold text-[#1E293B]'>Video</h2>
          {book.videoUrl ? (
            <div className='relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group'>
              <video
                src={book.videoUrl}
                className='w-full h-full object-cover'
                controls
              />
            </div>
          ) : (
            <div className='aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-3'>
              <FileVideo className='w-12 h-12 opacity-20' />
              <p className='font-medium'>No video presentation available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
