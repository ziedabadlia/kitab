"use client";

import type { BooksPage } from "../hooks/useBookTable.utils";
import { SearchX, Inbox } from "lucide-react";
import { useBookTable } from "../hooks/useBookTable";
import { UserTableSkeleton } from "../../users/components/UserTableSkeleton";
import { TablePagination } from "../../users/components/UsersTable/TablePagination";
import { BookRow } from "./BookRow";
import BookTableHeader from "./BooksTable/BooksTableHeader";
import ConfirmModal from "@/components/AdminConfirmModal";
import { TableEmptyState } from "@/components/TableEmptyState";

export function BookTable({ initialData }: { initialData: BooksPage }) {
  const table = useBookTable(initialData);

  if (table.isLoading) return <UserTableSkeleton />;

  return (
    <div className='space-y-6 bg-white p-5 rounded-2xl'>
      <BookTableHeader
        query={table.query}
        setQuery={table.setQuery}
        clearQuery={table.clearQuery}
      />

      <div
        className={`bg-white rounded-[14px]  ${
          table.isPlaceholderData
            ? "opacity-50 pointer-events-none"
            : "opacity-100"
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
              {table.processedData.length > 0 ? (
                table.processedData.map((book: any) => (
                  <BookRow
                    key={book.id}
                    book={book}
                    onDelete={() =>
                      table.setDeleteModal({
                        isOpen: true,
                        bookId: book.id,
                        bookTitle: book.title,
                      })
                    }
                  />
                ))
              ) : (
                <TableEmptyState
                  colSpan={5}
                  hasNoData={!table.query}
                  urlQuery={table.query}
                  onClear={table.clearQuery}
                  noDataTitle='No Books Yet'
                  noDataDescription='No books have been added to the library yet. Start by adding your first collection.'
                />
              )}
            </tbody>
          </table>
        </div>

        {table.totalPages > 1 && (
          <TablePagination
            currentPage={table.page}
            totalPages={table.totalPages}
            onPageChange={table.setPage}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={table.deleteModal.isOpen}
        onClose={() =>
          table.setDeleteModal((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={table.handleConfirmDelete}
        title='Delete Book'
        actionLabel='Delete Book'
        variant='destructive'
        description={
          <>
            Are you sure you want to delete{" "}
            <span className='font-semibold text-slate-900'>
              {table.deleteModal.bookTitle}
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
