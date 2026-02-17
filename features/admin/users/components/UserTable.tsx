"use client";

import { UserTableSkeleton } from "./UserTableSkeleton";
import { IdCardModal } from "./IdCardModal";
import { useUserTable } from "../hooks/useUserTable";
import { SearchX } from "lucide-react";
import TableHeader, { SortableHeader } from "./UsersTable/TableHeader";
import { UserRow } from "./UsersTable/UserRow";
import { TablePagination } from "./UsersTable/TablePagination";
import ConfirmModal from "@/components/AdminConfirmModal";

export function UserTable({
  initialData,
  totalPages: initTotal,
  currentPage: initPage,
}: any) {
  const {
    query,
    setQuery,
    page,
    setPage,
    processedData,
    totalPages,
    isLoading,
    isPlaceholderData,
    selectedImage,
    setSelectedImage,
    deleteModal,
    setDeleteModal,
    handleConfirmDelete,
    requestSort,
  } = useUserTable(initialData, initPage);

  if (isLoading && !isPlaceholderData) return <UserTableSkeleton />;

  return (
    <div
      className={`h-fit bg-white rounded-[14px] p-7 shadow-sm border border-slate-100 transition-opacity ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
    >
      <TableHeader
        query={query}
        setQuery={(val) => {
          setQuery(val);
          setPage(1);
        }}
      />

      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm text-slate-600'>
          <thead className='bg-slate-50 text-[#3A354E] border-b border-slate-100'>
            <tr>
              <SortableHeader
                label='Name'
                onClick={() => requestSort("name")}
              />
              <SortableHeader
                label='Date Joined'
                onClick={() => requestSort("dateJoined")}
              />
              <SortableHeader
                label='Books Borrowed'
                onClick={() => requestSort("booksBorrowed")}
              />
              <SortableHeader
                label='University ID No'
                onClick={() => requestSort("universityId")}
              />
              <th className='px-6 py-4 text-[#3A354E] font-normal'>
                University ID Card
              </th>
              <th className='px-6 py-4 text-[#3A354E] font-normal'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {processedData.length > 0 ? (
              processedData.map((user: any) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onViewId={setSelectedImage}
                  onDelete={() =>
                    setDeleteModal({
                      isOpen: true,
                      userId: user.id,
                      userName: user.name,
                      email: user.email,
                    })
                  }
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className='py-20 text-center'>
                  <div className='flex flex-col items-center'>
                    <SearchX className='text-slate-300 w-12 h-12 mb-2' />
                    <p>No users found matching "{query}"</p>
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

      {/* MODALS */}
      <IdCardModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage || ""}
        onClose={() => setSelectedImage(null)}
      />

      <ConfirmModal
        title='Delete User'
        description='Are you sure you want to delete this user?'
        actionLabel='Delete'
        variant='destructive'
        isOpen={deleteModal?.isOpen}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
