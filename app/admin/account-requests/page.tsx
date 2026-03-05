import { getAccountRequests } from "@/features/admin/accountRequests/actions/accountRequests";
import { AccountRequestsTable } from "@/features/admin/accountRequests/components/AccountRequestsTable";

export const revalidate = 300;

export default async function AccountRequestsPage() {
  const initialData = await getAccountRequests({
    page: 1,
    pageSize: 10,
    query: "",
    sortField: "createdAt",
    sortDirection: "desc",
  });

  return (
    <main className='p-8'>
      <AccountRequestsTable initialData={initialData} />
    </main>
  );
}
