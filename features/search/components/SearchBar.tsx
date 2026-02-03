"use client";

import { Search, X, ChevronDown } from "lucide-react";
import { memo, useRef, useEffect } from "react";
import { useSearchBar } from "@/features/search/hooks/useSearchBar";

interface SearchBarProps {
  onFilterChange?: () => void;
}

export default function SearchBar({ onFilterChange }: SearchBarProps) {
  const {
    query,
    filters,
    inputRef,
    departments,
    categories,
    isLoading,
    showFilters,
    activeFilterName,
    handleInputChange,
    handleClear,
    handleClearAll,
    handleFilterSelect,
    toggleFilters,
    closeFilters,
  } = useSearchBar(onFilterChange);

  return (
    <div className='w-full max-w-3xl mx-auto space-y-6'>
      {/* Golden Hero Text */}
      <div className='text-center space-y-3'>
        <p className='text-[#D6E0FF] text-xs md:text-sm font-medium tracking-widest uppercase'>
          Discover Your Next Great Read:
        </p>
        <h1 className='text-2xl md:text-4xl lg:text-5xl font-bold leading-tight'>
          <span className='text-white'>Explore and Search for</span>
          <br />
          <span className='text-[#E7C9A5]'>Any Book </span>
          <span className='text-white'>In Our Library</span>
        </h1>
      </div>

      {/* Search Input */}
      <div className='relative group'>
        {/* Golden Search Icon */}
        <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-[#E7C9A5] transition-colors' />
        </div>

        <input
          ref={inputRef}
          type='text'
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder='Search by title, author, or keyword...'
          className='w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-12 py-4 rounded-xl 
                     placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E7C9A5]/50 
                     focus:border-[#E7C9A5] caret-[#E7C9A5] transition-all duration-200'
        />

        {/* Typing Indicator / Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className='absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-[#E7C9A5] transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className='flex items-center justify-between'>
        <div className='relative'>
          <button
            onClick={toggleFilters}
            disabled={isLoading}
            className='flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 
                       rounded-lg text-sm text-slate-300 hover:text-white hover:border-[#E7C9A5]/50 
                       transition-all duration-200 disabled:opacity-50'
          >
            <span className='font-normal text-lg'>
              Filter by:{" "}
              <span className='font-semibold text-lg text-[#FFE1BD]'>
                {activeFilterName || "All"}
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          {showFilters && (
            <FilterDropdown
              departments={departments}
              categories={categories}
              filters={filters}
              onClose={closeFilters}
              onSelect={handleFilterSelect}
            />
          )}
        </div>

        {(query || filters.departmentId || filters.categoryId) && (
          <button
            onClick={handleClearAll}
            className='text-sm text-[#E7C9A5] hover:text-white transition-colors underline underline-offset-4'
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

const FilterDropdown = memo(function FilterDropdown({
  departments,
  categories,
  filters,
  onClose,
  onSelect,
}: {
  departments: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  filters: { departmentId?: string; categoryId?: string };
  onClose: () => void;
  onSelect: (filters: { departmentId?: string; categoryId?: string }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const isActive = (type: "all" | "dept" | "cat", id?: string) => {
    if (type === "all") return !filters.departmentId && !filters.categoryId;
    if (type === "dept") return filters.departmentId === id;
    return filters.categoryId === id;
  };

  return (
    <div
      ref={ref}
      className='absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 py-2'
    >
      <div className='px-3 py-2 text-xs font-semibold text-[#E7C9A5] uppercase tracking-wider'>
        Departments
      </div>

      <FilterButton
        label='All'
        isActive={isActive("all")}
        onClick={() => onSelect({})}
      />

      {departments.map((dept) => (
        <FilterButton
          key={dept.id}
          label={dept.name}
          isActive={isActive("dept", dept.id)}
          onClick={() => onSelect({ departmentId: dept.id })}
        />
      ))}

      <div className='border-t border-slate-700 my-2' />

      <div className='px-3 py-2 text-xs font-semibold text-[#E7C9A5] uppercase tracking-wider'>
        Categories
      </div>

      {categories.map((cat) => (
        <FilterButton
          key={cat.id}
          label={cat.name}
          isActive={isActive("cat", cat.id)}
          onClick={() => onSelect({ categoryId: cat.id })}
        />
      ))}
    </div>
  );
});

const FilterButton = memo(function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors
                 ${isActive ? "text-[#E7C9A5] bg-[#E7C9A5]/10" : "text-slate-300"}`}
    >
      {label}
    </button>
  );
});
