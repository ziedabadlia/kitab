// app/admin/account-requests/page.tsx  (Server Component)
//
// Fetches page 1 on the server — renders instantly with real data, no spinner.
// React Query takes over from page 2 onwards, caching each page as visited.
import { getAccountRequests } from "@/features/admin/accountRequests/actions/accountRequests";
import { AccountRequestsTable } from "@/features/admin/accountRequests/components/AccountRequestsTable";

export default async function AccountRequestsPage() {
  // Always fetch the default view (page 1, no query, default sort) server-side.
  // This is the most common state an admin lands on — serve it instantly.
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
