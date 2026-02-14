import { UserTable } from "@/features/admin/users/components/UserTable";
import { getUsersAction } from "@/features/admin/users/actions/user";

export default async function AllUsersPage() {
  const { users, totalPages } = await getUsersAction({ page: 1 });

  return (
    <div className='w-full p-6 space-y-6'>
      <UserTable initialData={users} totalPages={totalPages} currentPage={1} />
    </div>
  );
}
