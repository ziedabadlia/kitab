import { useQuery } from "@tanstack/react-query";
import { fetchUniversities } from "../lib/fetchUniversities";

const useFetchUniversities = (search: string) => {
  const { data: universities = [], isLoading: isLoadingOptions } = useQuery({
    queryKey: ["universities", search],
    queryFn: () => fetchUniversities(search),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes — university list rarely changes
    enabled: (search ?? "").trim().length > 0, // only fetch when user has typed something
  });

  return { universities, isLoadingOptions };
};

export default useFetchUniversities;
