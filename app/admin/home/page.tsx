import { getDashboardStats } from "@/features/dashboard/actions/dashboard";
import { RecentAccountRequests } from "@/features/dashboard/components/RecentAccountRequests";
import { RecentBorrowRequests } from "@/features/dashboard/components/RecentBorrowRequests";
import { RecentlyAddedBooks } from "@/features/dashboard/components/RecentlyAddedBooks";
import { StatCard } from "@/features/dashboard/components/StatCard";

export default async function AdminDashboardPage() {
  const { stats, recentBooks, recentBorrowRequests, recentAccountRequests } =
    await getDashboardStats();

  return (
    <div className='space-y-6'>
      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
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

      {/* ── Main Content Grid ───────────────────────────────────────────────── */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <RecentBorrowRequests
            requests={recentBorrowRequests}
            pendingCount={stats.pendingBorrowRequests}
          />
          <RecentAccountRequests
            requests={recentAccountRequests}
            pendingCount={stats.pendingAccountRequests}
          />
        </div>

        <RecentlyAddedBooks books={recentBooks} />
      </div>
    </div>
  );
}
