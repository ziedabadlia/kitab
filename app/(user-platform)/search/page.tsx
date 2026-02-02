import SearchContent from "@/features/search/components/SearchContent";
import { SearchProvider } from "@/features/search/contexts/SearchContext";

export default function SearchPage() {
  return (
    <SearchProvider>
      <SearchContent />
    </SearchProvider>
  );
}
