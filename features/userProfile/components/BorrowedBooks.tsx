"use client";

import { BorrowedBook } from "../types";
import NoResults from "./NoREsult";
import { useBorrowedBooksLogic } from "../hooks/useBorrowedBooksLogic";
import BorrowedBooksHeader from "./BorrowedBooks/BorrowedBooksHeader";
import BorrowedBooksGrid from "./BorrowedBooks/BorrowedBooksGrid";
import ReceiptModal from "./ReceiptModal";

interface BorrowedBooksProps {
  books: BorrowedBook[];
}

export default function BorrowedBooks({ books }: BorrowedBooksProps) {
  const { isEmpty, selectedReceiptBook, handleReceiptClick, handleCloseModal } =
    useBorrowedBooksLogic(books);

  if (isEmpty) {
    return (
      <div className='bg-[#0F1117] rounded-3xl p-8 border border-slate-800/50 min-h-[500px] flex items-center justify-center'>
        <NoResults
          title='No Results Found'
          description="We couldn't find any books. Try adjusting your filters or check back later."
        />
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <BorrowedBooksHeader bookCount={books.length} />

      {/* Grid Layout */}
      <BorrowedBooksGrid books={books} onReceiptClick={handleReceiptClick} />

      {/* Render Receipt Modal */}
      {selectedReceiptBook && (
        <ReceiptModal
          isOpen={!!selectedReceiptBook}
          onClose={handleCloseModal}
          book={selectedReceiptBook}
        />
      )}
    </div>
  );
}
