// app/admin/borrow-requests/page.tsx  (Server Component)

import {
  BorrowSortField,
  getBorrowingRequests,
  SortDirection,
} from "@/features/admin/borrowRequests/actions/borrowing";
import { BorrowRequestsTable } from "@/features/admin/borrowRequests/components/BorrowRequestsTable";

interface PageProps {
  // Next.js 15: searchParams is a Promise
  searchParams: Promise<{
    page?: string;
    query?: string;
    sort?: string;
    dir?: string;
  }>;
}

export default async function BorrowRequestsPage({ searchParams }: PageProps) {
  // Await searchParams before accessing its properties
  const params = await searchParams;

  const data = await getBorrowingRequests({
    page: Number(params.page ?? "1"),
    pageSize: 10,
    query: params.query ?? "",
    sortField: (params.sort as BorrowSortField) ?? "createdAt",
    sortDirection: (params.dir as SortDirection) ?? "desc",
  });

  return (
    <main>
      <BorrowRequestsTable initialData={data} />
    </main>
  );
}
