import AdminSideBar from "@/components/AdminSideBar";
import { auth } from "@/features/auth/auth";
import { ReactNode } from "react";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <div className='flex min-h-screen bg-white text-white'>
      <aside className='fixed inset-y-0 left-0 z-50'>
        <AdminSideBar session={session!} />
      </aside>

      <main className='flex-1 pl-72 min-h-screen bg-[#F8F8FF] rounded-tl-4xl border-2 border-[#EDF1F1]'>
        {/* Simple Top Header */}
        <header className='h-20 flex items-center justify-between px-10 z-40'>
          <div>
            <h2 className='text-2xl text-[#1E293B] font-semibold'>
              Welcome, Admin
            </h2>
            <p className='text-slate-500 font-normal text-[16px]'>
              Monitor all of your projects and tasks here
            </p>
          </div>
        </header>

        <div className='p-10'>{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
