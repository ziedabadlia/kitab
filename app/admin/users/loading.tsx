import { UserTableSkeleton } from "@/features/admin/users/components/UserTableSkeleton";

export default function Loading() {
  return (
    <div className='w-full p-6 space-y-6'>
      <UserTableSkeleton />
    </div>
  );
}
