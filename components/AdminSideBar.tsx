"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Users,
  Book,
  LayoutList,
  UserRoundCheck,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";

const adminNavItems = [
  { name: "Home", href: "/admin", icon: Home },
  { name: "All Users", href: "/admin/users", icon: Users },
  { name: "All Books", href: "/admin/books", icon: Book },
  { name: "Borrow Requests", href: "/admin/borrow-requests", icon: LayoutList },
  {
    name: "Account Requests",
    href: "/admin/account-requests",
    icon: UserRoundCheck,
  },
];

interface SidebarProps {
  session: Session | null;
}

const Sidebar = ({ session }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div className='flex h-full w-72 flex-col bg-white p-5 shadow-sm border-r border-slate-100'>
      {/* 1. LOGO SECTION */}
      <div className='flex items-center gap-2 px-2 mb-10'>
        <div className='w-10 h-10 flex items-center justify-center bg-indigo-900 rounded-lg'>
          <Book className='text-white w-6 h-6' />
        </div>
        <span className='text-[#1E293B] font-bold text-2xl tracking-tight'>
          BookWise
        </span>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav className='flex-1 space-y-2'>
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                isActive
                  ? "bg-[#253585] text-white shadow-md shadow-blue-900/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-slate-400",
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. USER PROFILE SECTION */}
      <div className='mt-auto p-2 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Image
              src={session?.user?.image || "/icons/user.svg"}
              alt='Avatar'
              width={40}
              height={40}
              className='rounded-full object-cover border border-white shadow-sm'
            />
            {/* Online Status Dot */}
            <div className='absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full' />
          </div>
          <div className='flex flex-col overflow-hidden max-w-[140px]'>
            <p className='text-sm font-bold text-slate-800 truncate'>
              {session?.user?.name || "Admin User"}
            </p>
            <p className='text-xs text-slate-500 truncate'>
              {session?.user?.email || "admin@jsmastery.pro"}
            </p>
          </div>
        </div>

        <button className='p-2 hover:bg-red-50 rounded-lg group transition-colors'>
          <LogOut className='w-5 h-5 text-red-400 group-hover:text-red-600' />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
