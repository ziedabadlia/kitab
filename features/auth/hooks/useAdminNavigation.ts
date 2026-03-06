import { usePathname } from "next/navigation";
import { useMemo } from "react";

import whiteHomeIconSvg from "@/assets/svg/admin/whiteHomeIcon.svg";
import whiteUsersIconSvg from "@/assets/svg/admin/whiteUsersIcon.svg";
import whiteBooksIconSvg from "@/assets/svg/admin/whiteBook.svg";
import whiteBorrowRequestsIconSvg from "@/assets/svg/admin/whiteBorrowRequestIcon.svg";
import whiteAccountRequestsIconSvg from "@/assets/svg/admin/whiteAccountsReqeustsIcon.svg";
import greyHomeIconSvg from "@/assets/svg/admin/greyHomeIcon.svg";
import greyUsersIconSvg from "@/assets/svg/admin/greyUsersIcon.svg";
import greyBooksIconSvg from "@/assets/svg/admin/greyBookIcon.svg";
import greyBorrowRequestsIconSvg from "@/assets/svg/admin/greyBorrowRequestIcon.svg";
import greyAccountRequestsIconSvg from "@/assets/svg/admin/greyAccountsReqeustsIcon.svg";

export const useAdminNavigation = () => {
  const pathname = usePathname();

  const navItems = useMemo(
    () => [
      {
        name: "Home",
        href: "/admin/home",
        icons: [whiteHomeIconSvg, greyHomeIconSvg],
      },
      {
        name: "All Users",
        href: "/admin/users",
        icons: [whiteUsersIconSvg, greyUsersIconSvg],
      },
      {
        name: "All Books",
        href: "/admin/books",
        icons: [whiteBooksIconSvg, greyBooksIconSvg],
      },
      {
        name: "Borrow Requests",
        href: "/admin/borrow-requests",
        icons: [whiteBorrowRequestsIconSvg, greyBorrowRequestsIconSvg],
      },
      {
        name: "Account Requests",
        href: "/admin/account-requests",
        icons: [whiteAccountRequestsIconSvg, greyAccountRequestsIconSvg],
      },
    ],
    [],
  );

  const routes = useMemo(() => {
    return navItems.map((item) => ({
      ...item,
      isActive: pathname === item.href || pathname.startsWith(item.href + "/"),
    }));
  }, [pathname, navItems]);

  return { routes };
};
