import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavItemProps {
  name: string;
  href: string | string[];
  isActive: boolean;
  icons: string[];
}

export const NavItem = ({ name, href, isActive, icons }: NavItemProps) => {
  // Logic to determine the target link
  const targetHref = Array.isArray(href) ? href[0] : href;

  return (
    <Link
      href={targetHref}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
        isActive
          ? "bg-[#253585] text-white shadow-md shadow-blue-900/20"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <Image
        src={isActive ? icons[0] : icons[1]}
        alt={name}
        width={20}
        height={20}
        className='shrink-0'
      />
      <span className='truncate'>{name}</span>
    </Link>
  );
};
