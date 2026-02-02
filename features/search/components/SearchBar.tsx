"use client";

import { Search, X, ChevronDown } from "lucide-react";
import { useSearch } from "@/features/search/contexts/SearchContext";
import { useState, useRef, useEffect, memo } from "react";
import { useFilterOptions } from "@/features/search/hooks/useFilterOptions";

interface SearchBarProps {
  onFilterChange?: () => void;
}

export default function SearchBar({ onFilterChange }: SearchBarProps) {
  const { query, setQuery, filters, setFilters, clearSearch } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useFilterOptions();
  const departments = data?.departments || [];
  const categories = data?.categories || [];

  const activeFilterName = filters.departmentId
    ? departments.find((d) => d.id === filters.departmentId)?.name
    : filters.categoryId
      ? categories.find((c) => c.id === filters.categoryId)?.name
      : null;

  const handleClearSearch = () => {
    clearSearch();
    onFilterChange?.();
  };

  return (
    <div className='w-full max-w-2xl mx-auto space-y-4'>
      {/* Search Input */}
      <div className='relative group'>
        <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors' />
        </div>

        <input
          ref={inputRef}
          type='text'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onFilterChange?.();
          }}
          placeholder='Search by title, author, or keyword...'
          className='w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-12 py-4 rounded-xl 
                     placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                     focus:border-blue-500 transition-all duration-200'
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              onFilterChange?.();
              inputRef.current?.focus();
            }}
            className='absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-white transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className='flex items-center justify-between'>
        <div className='relative'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            disabled={isLoading}
            className='flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 
                       rounded-lg text-sm text-slate-300 hover:text-white hover:border-slate-600 
                       transition-all duration-200 disabled:opacity-50'
          >
            <span>Filter by: {activeFilterName || "All"}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          {showFilters && (
            <FilterDropdown
              departments={departments}
              categories={categories}
              onClose={() => setShowFilters(false)}
              onSelect={() => onFilterChange?.()}
            />
          )}
        </div>

        {(query || filters.departmentId || filters.categoryId) && (
          <button
            onClick={handleClearSearch}
            className='text-sm text-slate-400 hover:text-blue-400 transition-colors underline underline-offset-4'
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
  onClose,
  onSelect,
}: {
  departments: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSelect?: () => void;
}) {
  const { setFilters, filters } = useSearch();
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

  const handleSelect = (newFilters: typeof filters) => {
    setFilters(newFilters);
    onSelect?.();
    onClose();
  };

  return (
    <div
      ref={ref}
      className='absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 py-2'
    >
      <div className='px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider'>
        Departments
      </div>
      <button
        onClick={() => handleSelect({})}
        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors
                   ${!filters.departmentId && !filters.categoryId ? "text-blue-400 bg-blue-500/10" : "text-slate-300"}`}
      >
        All
      </button>
      {departments.map((dept) => (
        <button
          key={dept.id}
          onClick={() => handleSelect({ departmentId: dept.id })}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors
                     ${filters.departmentId === dept.id ? "text-blue-400 bg-blue-500/10" : "text-slate-300"}`}
        >
          {dept.name}
        </button>
      ))}

      <div className='border-t border-slate-700 my-2' />

      <div className='px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider'>
        Categories
      </div>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect({ categoryId: cat.id })}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors
                     ${filters.categoryId === cat.id ? "text-blue-400 bg-blue-500/10" : "text-slate-300"}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
});
FilterDropdown.displayName = "FilterDropdown";
