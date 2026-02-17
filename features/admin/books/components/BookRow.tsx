import Link from "next/link";
import { Edit3, Trash2 } from "lucide-react";
import BookCover from "@/components/BookCover";
import { Book } from "../types"; // Using the types we created earlier
import editIconSvg from "@/assets/svg/admin/editIcon.svg";
import trashIconSvg from "@/assets/svg/admin/trashIcon.svg";
import Image from "next/image";

interface BookRowProps {
  book: Book & { coverColor?: string }; // Extending type for coverColor
  onDelete: () => void;
}

export function BookRow({ book, onDelete }: BookRowProps) {
  return (
    <tr className='hover:bg-slate-50/50 transition-colors group'>
      <td className='px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div className='relative w-10 h-14 overflow-hidden rounded shadow-sm border border-slate-100 flex-shrink-0'>
            <BookCover
              coverImage={book.coverImageUrl!}
              coverColor={book.coverColor}
            />
          </div>
          <span
            className='font-semibold text-slate-900 line-clamp-1'
            title={book.title}
          >
            {book.title}
          </span>
        </div>
      </td>
      <td className='px-6 py-4 font-medium text-slate-700'>{book.author}</td>
      <td className='px-6 py-4 text-slate-500 whitespace-nowrap'>
        {book.genre}
      </td>
      <td className='px-6 py-4 text-slate-500 whitespace-nowrap'>
        {book.createdAt}
      </td>
      <td className='px-6 py-4'>
        <div className='flex items-center justify-end gap-2'>
          <Link
            href={`/admin/books/${book.id}`}
            className='text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all'
            title='Edit Book'
          >
            <Image src={editIconSvg} width={20} height={20} alt='edit' />
          </Link>
          <button
            onClick={onDelete}
            className='text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-all cursor-pointer'
            title='Delete Book'
          >
            <Image src={trashIconSvg} width={20} height={20} alt='edit' />
          </button>
        </div>
      </td>
    </tr>
  );
}
