import { Suspense } from "react";
import {
  getDashboardStats,
  getRecentBooks,
  getRecentBorrowRequests,
  getRecentAccountRequests,
} from "@/features/dashboard/actions/dashboard";
import { RecentAccountRequests } from "@/features/dashboard/components/RecentAccountRequests";
import { RecentBorrowRequests } from "@/features/dashboard/components/RecentBorrowRequests";
import { RecentlyAddedBooks } from "@/features/dashboard/components/RecentlyAddedBooks";
import { StatCard } from "@/features/dashboard/components/StatCard";
import {
  StatCardsSkeleton,
  BorrowRequestsSkeleton,
  AccountRequestsSkeleton,
  RecentlyAddedBooksSkeleton,
} from "@/features/dashboard/components/DashboardSkeleton";

// ── Async sections ────────────────────────────────────────────────────────────

async function StatCardsSection() {
  const stats = await getDashboardStats();
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
      <StatCard
        label='Borrowed Books'
        value={stats.borrowedBooks}
        delta={stats.borrowGrowth}
        positiveIsGood={false}
      />
      <StatCard
        label='Total Users'
        value={stats.totalUsers}
        delta={stats.userGrowth}
        positiveIsGood={true}
      />
      <StatCard
        label='Total Books'
        value={stats.totalBooks}
        delta={stats.bookGrowth}
        positiveIsGood={true}
      />
    </div>
  );
}

async function BorrowRequestsSection() {
  const [requests, stats] = await Promise.all([
    getRecentBorrowRequests(),
    getDashboardStats(),
  ]);
  return (
    <RecentBorrowRequests
      requests={requests}
      pendingCount={stats.pendingBorrowRequests}
    />
  );
}

async function AccountRequestsSection() {
  const [requests, stats] = await Promise.all([
    getRecentAccountRequests(),
    getDashboardStats(),
  ]);
  return (
    <RecentAccountRequests
      requests={requests}
      pendingCount={stats.pendingAccountRequests}
    />
  );
}

async function RecentBooksSection() {
  const books = await getRecentBooks();
  return <RecentlyAddedBooks books={books} />;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className='space-y-6'>
      <Suspense fallback={<StatCardsSkeleton />}>
        <StatCardsSection />
      </Suspense>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <Suspense fallback={<BorrowRequestsSkeleton />}>
            <BorrowRequestsSection />
          </Suspense>
          <Suspense fallback={<AccountRequestsSkeleton />}>
            <AccountRequestsSection />
          </Suspense>
        </div>

        <Suspense fallback={<RecentlyAddedBooksSkeleton />}>
          <RecentBooksSection />
        </Suspense>
      </div>
    </div>
  );
}
