import { db } from "@/lib/db";
import { getUsersAction } from "@/features/admin/users/actions/user";
import { UserTable } from "@/features/admin/users/components/UserTable";

export default async function UsersPage() {
  const [initialData, totalUsers] = await Promise.all([
    getUsersAction({ page: 1, search: "" }),
    db.student.count(),
  ]);

  return (
    <div className='w-full p-6 space-y-6'>
      <UserTable
        initialData={{
          users: initialData.users,
          totalPages: initialData.totalPages,
          totalUsers,
        }}
      />
    </div>
  );
}
