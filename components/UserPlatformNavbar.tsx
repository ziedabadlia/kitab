"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/features/auth/actions/logout";

interface NavbarProps {
  userName: string;
  profilePictureUrl: string;
}

const Navbar = ({ userName, profilePictureUrl }: NavbarProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    setHasScrolled(window.scrollY > 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const navClasses = useMemo(
    () =>
      cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-5 md:px-10 lg:px-20 py-5",
        hasScrolled
          ? "bg-[#05070A]/80 backdrop-blur-md border-b border-white/5"
          : "bg-transparent",
      ),
    [hasScrolled],
  );

  const homeLinkClasses = useMemo(
    () =>
      cn(
        "text-sm font-medium transition-colors hover:text-[#E7C9A5]",
        pathname === "/" ? "text-[#E7C9A5]" : "text-slate-300",
      ),
    [pathname],
  );

  const searchLinkClasses = useMemo(
    () =>
      cn(
        "text-sm font-medium transition-colors hover:text-[#E7C9A5]",
        pathname === "/search" ? "text-[#E7C9A5]" : "text-slate-300",
      ),
    [pathname],
  );

  return (
    <nav className={navClasses}>
      <div className='flex items-center justify-between max-w-7xl mx-auto'>
        {/* Brand Logo & Name */}
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='https://res.cloudinary.com/dt7w60zoz/image/upload/v1769089532/logo_l5yyom.png'
            alt='KITAB Logo'
            width={40}
            height={40}
          />
          <span className='text-white font-bold text-2xl tracking-tight hidden sm:block'>
            KITAB
          </span>
        </Link>

        {/* Navigation Links & User Profile */}
        <div className='flex items-center gap-4 md:gap-8'>
          <Link href='/' className={homeLinkClasses}>
            Home
          </Link>
          <Link href='/search' className={searchLinkClasses}>
            Search
          </Link>

          {/* User Profile Avatar */}
          <Link href='/profile' className='flex items-center gap-2 group'>
            <div className='w-8 h-8 rounded-full bg-[#A3E635] flex items-center justify-center text-[#05070A] font-bold text-xs ring-2 ring-transparent group-hover:ring-[#E7C9A5] transition-all'>
              {profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
                  alt={userName}
                  width={32}
                  height={32}
                  className='w-full h-full object-cover rounded-full'
                  priority
                />
              ) : (
                userName?.slice(0, 2).toUpperCase()
              )}
            </div>
            <span className='text-white text-sm font-semibold hidden md:block'>
              {userName || "Adrian"}
            </span>
          </Link>

          {/* Logout Button */}
          <form action={logout}>
            <Button
              size='icon'
              type='submit'
              className='text-red-500 bg-transparent cursor-pointer'
            >
              <LogOut className='h-5 w-5' />
            </Button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
