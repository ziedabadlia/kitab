import { useEffect, useState } from "react";
import { fetchUniversities } from "../lib/fetchUniversities";
import { UniversityOption } from "../types/university";

const useFetchUniversities = (): {
  universities: UniversityOption[];
  isLoadingOptions: boolean;
} => {
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await fetchUniversities();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    loadUniversities();
  }, []);

  return { universities, isLoadingOptions };
};

export default useFetchUniversities;
