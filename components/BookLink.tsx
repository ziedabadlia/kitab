import Link from "next/link";
import { ReactNode } from "react";

interface BookLinkProps {
  id: string;
  children: ReactNode;
  className?: string;
  title?: string;
}

const BookLink = ({ id, children, className = "", title }: BookLinkProps) => {
  return (
    <Link
      href={`/books/${id}`}
      className={`block group cursor-pointer ${className}`}
      aria-label={title ? `View details for ${title}` : "View book details"}
    >
      {children}
    </Link>
  );
};

export default BookLink;
