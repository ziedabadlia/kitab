"use client";

import Image from "next/image";
import adminLogoSvg from "@/public/adminLogo.svg";
import { Session } from "next-auth";
import { useAdminNavigation } from "@/features/auth/hooks/useAdminNavigation";
import { NavItem } from "./AdminSideBar/NavItem";
import { AdminProfile } from "./AdminSideBar/AdminProfile";

export default function AdminSideBar({ session }: { session: Session }) {
  const { routes } = useAdminNavigation();

  return (
    <aside className='flex h-screen w-full flex-col bg-white p-5 border-r border-slate-100 md:w-72'>
      <header className='flex items-center gap-2 px-2 pb-2 mb-5'>
        <Image
          src={adminLogoSvg}
          alt='Admin Logo'
          width={37}
          height={37}
          priority
        />
        <h1 className='text-[#1E293B] font-semibold text-[26px] tracking-tight'>
          KITAB
        </h1>
      </header>

      <hr className='border-t-2 border-dashed border-[#8C8E98] mb-5 opacity-30' />

      <nav className='flex-1 space-y-2 overflow-y-auto no-scrollbar'>
        {routes.map((route) => (
          <NavItem key={route.name} {...route} />
        ))}
      </nav>

      <footer className='pt-5'>
        <AdminProfile session={session} />
      </footer>
    </aside>
  );
}
