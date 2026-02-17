"use client";

import { SearchX } from "lucide-react";
import { useBookTable } from "../hooks/useBookTable";
import { UserTableSkeleton } from "../../users/components/UserTableSkeleton";
import { TablePagination } from "../../users/components/UsersTable/TablePagination";
import { BookRow } from "./BookRow";
import BookTableHeader from "./BooksTable/BooksTableHeader";
import ConfirmModal from "@/components/AdminConfirmModal";

export function BookTable({ initialData }: { initialData: any }) {
  const {
    query,
    setQuery,
    page,
    setPage,
    processedData,
    totalPages,
    isLoading,
    isPlaceholderData,
    requestSort,
    sortConfig,
    // Deletion states from the hook
    deleteModal,
    setDeleteModal,
    handleConfirmDelete,
  } = useBookTable(initialData, 1);

  if (isLoading && !isPlaceholderData) return <UserTableSkeleton />;

  return (
    <div className='space-y-6'>
      <BookTableHeader
        query={query}
        setQuery={(val) => {
          setQuery(val);
          setPage(1); // Reset to page 1 on search
        }}
        onSort={() => requestSort("title")}
        sortConfig={sortConfig}
      />

      <div
        className={`bg-white rounded-[14px] p-7 shadow-sm border border-slate-100 transition-opacity ${
          isPlaceholderData ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-600'>
            <thead className='bg-slate-50 text-[#3A354E] border-b border-slate-100'>
              <tr>
                <th className='px-6 py-4 font-normal'>Book Title</th>
                <th className='px-6 py-4 font-normal'>Author</th>
                <th className='px-6 py-4 font-normal'>Genre</th>
                <th className='px-6 py-4 font-normal'>Date Created</th>
                <th className='px-6 py-4 font-normal text-right'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {processedData.length > 0 ? (
                processedData.map((book: any) => (
                  <BookRow
                    key={book.id}
                    book={book}
                    onDelete={() =>
                      setDeleteModal({
                        isOpen: true,
                        bookId: book.id,
                        bookTitle: book.title,
                      })
                    }
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='py-20 text-center'>
                    <div className='flex flex-col items-center text-slate-400'>
                      <SearchX className='w-12 h-12 mb-2 opacity-20' />
                      <p>No books found matching "{query}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* REUSABLE DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title='Delete Book'
        actionLabel='Delete Book'
        variant='destructive'
        description={
          <>
            Are you sure you want to delete{" "}
            <span className='font-semibold text-slate-900'>
              {deleteModal.bookTitle}
            </span>
            ?
            <br />
            <span className='text-red-600 font-medium'>
              This action is irreversible.
            </span>
          </>
        }
      />
    </div>
  );
}
