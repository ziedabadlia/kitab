import SearchContent from "@/features/search/components/SearchContent";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Books | Kitab",
  description: "Search and discover books in the Kitab library",
};

export default function SearchPage() {
  return <SearchContent />;
}
