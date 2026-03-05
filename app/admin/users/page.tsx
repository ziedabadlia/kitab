import { getUsersAction } from "@/features/admin/users/actions/user";
import { UserTable } from "@/features/admin/users/components/UserTable";

export const revalidate = 300;

export default async function UsersPage() {
  const initialData = await getUsersAction({ page: 1, search: "" });

  return (
    <div className='w-full p-6 space-y-6'>
      <UserTable initialData={initialData} />
    </div>
  );
}
