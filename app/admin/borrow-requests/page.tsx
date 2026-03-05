import { getBorrowingRequests } from "@/features/admin/borrowRequests/actions/borrowing";
import { BorrowRequestsTable } from "@/features/admin/borrowRequests/components/BorrowRequestsTable";

export const revalidate = 300;

export default async function BorrowRequestsPage() {
  const initialData = await getBorrowingRequests({
    page: 1,
    pageSize: 10,
    query: "",
    sortField: "createdAt",
    sortDirection: "desc",
  });

  return (
    <main>
      <BorrowRequestsTable initialData={initialData} />
    </main>
  );
}
