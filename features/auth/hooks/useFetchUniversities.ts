import { useEffect, useState } from "react";
import { fetchUniversities } from "../lib/fetchUniversities";

const useFetchUniversities = (): {
  universities: string[];
  isLoadingOptions: boolean;
} => {
  const [universities, setUniversities] = useState<string[]>([]);
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
