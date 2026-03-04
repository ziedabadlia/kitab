"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useUniversitySelect from "../hooks/useUniversitySelect";

interface UniversitySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const UniversitySelect = ({
  value,
  onChange,
  disabled,
}: UniversitySelectProps) => {
  const {
    open,
    setOpen,
    search,
    setSearch,
    debouncedSearch,
    universities,
    isLoadingOptions,
    handleSelect,
  } = useUniversitySelect();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-between px-4 text-sm bg-[#232839] border-none rounded-[5px] font-normal hover:bg-[#2a3048]",
            value ? "text-white" : "text-slate-400",
          )}
        >
          <span className='truncate'>{value || "-- Select University --"}</span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 text-slate-400' />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='p-0 bg-[#1a1f2e] border border-white/10 rounded-[8px] shadow-2xl'
        style={{ width: "var(--radix-popover-trigger-width)" }}
        align='start'
      >
        {/* Search input */}
        <div className='px-2 pt-2 pb-1 border-b border-white/10'>
          <Input
            placeholder='Search university...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='h-8 text-sm bg-[#232839] border-none text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[5px]'
            autoFocus
          />
        </div>

        {/* Results list */}
        <div
          className='max-h-52 overflow-y-auto py-1'
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e7c9a5 transparent",
          }}
        >
          {isLoadingOptions ? (
            <div className='flex items-center justify-center gap-2 px-4 py-3 text-sm text-slate-400'>
              <Loader2 className='h-3 w-3 animate-spin' />
              Searching...
            </div>
          ) : universities.length === 0 ? (
            <p className='px-4 py-3 text-sm text-slate-400 text-center'>
              {debouncedSearch
                ? "No universities found"
                : "Type to search universities"}
            </p>
          ) : (
            universities.map((uni) => (
              <button
                key={uni.id}
                type='button'
                onClick={() => handleSelect(uni.name, onChange)}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm text-white hover:bg-[#e7c9a5]/10 flex items-center justify-between gap-2 transition-colors",
                  value === uni.name && "text-[#e7c9a5] bg-[#e7c9a5]/10",
                )}
              >
                <span className='truncate'>{uni.name}</span>
                {value === uni.name && (
                  <Check className='h-3.5 w-3.5 shrink-0 text-[#e7c9a5]' />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UniversitySelect;
