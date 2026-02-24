"use client";
import ConfirmModal from "@/components/AdminConfirmModal";
import { IdCardModal } from "./IdCardModal";
import { TablePagination } from "./UsersTable/TablePagination";
import { TableEmptyState } from "@/components/TableEmptyState";
import { UserRow } from "./UsersTable/UserRow";
import TableHeader, { SortableHeader } from "./UsersTable/TableHeader";
import { UserTableSkeleton } from "./UserTableSkeleton";
import { useUserTable } from "../hooks/useUserTable";
import { UsersPage } from "../types/users";

export function UserTable({ initialData }: { initialData: UsersPage }) {
  const {
    localSearch,
    setLocalSearch,
    page,
    setPage,
    data,
    isLoading,
    isPlaceholderData,
    sortConfig,
    requestSort,
    selectedImage,
    setSelectedImage,
    deleteModal,
    setDeleteModal,
    handleConfirmDelete,
    updateUrl,
    isDeleting,
  } = useUserTable(initialData);

  if (isLoading) return <UserTableSkeleton />;

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div
      className={`h-fit bg-white rounded-[14px] p-7 shadow-sm border border-slate-100 transition-opacity ${isPlaceholderData ? "opacity-50 pointer-events-none" : ""}`}
    >
      <TableHeader
        query={localSearch}
        setQuery={setLocalSearch}
        clearQuery={() => {
          setLocalSearch("");
          updateUrl({ search: null });
        }}
        sortConfig={sortConfig}
        requestSort={requestSort}
      />

      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm text-slate-600'>
          <thead className='bg-slate-50 text-[#3A354E] border-b border-slate-100'>
            <tr>
              <SortableHeader
                label='Name'
                sortKey='fullName'
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <SortableHeader
                label='Date Joined'
                sortKey='createdAt'
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <SortableHeader
                label='Books Borrowed'
                sortKey='booksBorrowed'
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <th className='px-6 py-4 font-normal'>University ID No</th>
              <th className='px-6 py-4 font-normal'>University ID Card</th>
              <th className='px-6 py-4 font-normal'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {users.length > 0 ? (
              users.map((user: any) => (
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
              <TableEmptyState
                colSpan={6}
                hasNoData={!localSearch} // If search is empty, we have NO data at all
                urlQuery={localSearch}
                onClear={() => {
                  setLocalSearch("");
                  updateUrl({ search: null });
                }}
                noDataTitle='No Users Yet'
                noDataDescription='No students have registered in the library system yet.'
              />
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

      <IdCardModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage || ""}
        onClose={() => setSelectedImage(null)}
      />

      <ConfirmModal
        title='Delete User'
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal((p) => ({ ...p, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        actionLabel='Delete User'
        description={`Are you sure you want to delete ${deleteModal.userName}?`}
        variant='destructive'
        isLoading={isDeleting}
      />
    </div>
  );
}
