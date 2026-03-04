import { useState } from "react";
import { useDebounce } from "use-debounce";
import useFetchUniversities from "./useFetchUniversities";

const useUniversitySelect = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);

  const { universities, isLoadingOptions } =
    useFetchUniversities(debouncedSearch);

  const handleSelect = (name: string, onChange: (value: string) => void) => {
    onChange(name);
    setOpen(false);
    setSearch("");
  };

  return {
    open,
    setOpen,
    search,
    setSearch,
    debouncedSearch,
    universities,
    isLoadingOptions,
    handleSelect,
  };
};

export default useUniversitySelect;
