// app/admin/users/page.tsx  (Server Component)
import { getUsersAction } from "@/features/admin/users/actions/user";
import { UserTable } from "@/features/admin/users/components/UserTable";

export default async function UsersPage() {
  // getUsersAction already filters ACCEPTED students so totalPages is correct —
  // the old db.student.count() counted ALL students including SUSPENDED ones,
  // making totalPages larger than it should be and causing phantom extra pages.
  const initialData = await getUsersAction({ page: 1, search: "" });

  return (
    <div className='w-full p-6 space-y-6'>
      <UserTable initialData={initialData} />
    </div>
  );
}
