"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookFormValues } from "../../validation/bookSchema";
import { toast } from "sonner";
import { createDepartment } from "../../actions/taxonomy";

interface Props {
  form: UseFormReturn<BookFormValues>;
  departments: { id: string; name: string }[];
}

export function DepartmentSelector({ form, departments }: Props) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [items, setItems] = React.useState(departments);

  const selectedValue = form.watch("departmentId");
  const trimmed = search.trim();

  // Filter manually so spaces don't confuse Command's built-in filter
  const filtered = search
    ? items.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  const exactMatch = items.some(
    (d) => d.name.toLowerCase() === trimmed.toLowerCase(),
  );
  const showCreate = trimmed.length > 0 && !exactMatch;

  const handleCreate = async () => {
    if (!trimmed) return;
    setIsCreating(true);
    try {
      const result = await createDepartment(trimmed);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setItems((prev) => [...prev, result]);
      form.setValue("departmentId", result.id, { shouldValidate: true });
      setSearch("");
      setOpen(false);
      toast.success(`Department "${result.name}" created.`);
    } catch {
      toast.error("Failed to create department.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className='space-y-1 flex flex-col'>
      <label className='text-sm font-medium text-slate-600'>
        Department <span className='text-red-500'>*</span>
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-slate-900 bg-slate-50 border-slate-200 font-normal h-10 px-3",
              !selectedValue && "text-slate-400",
            )}
          >
            {selectedValue
              ? items.find((d) => d.id === selectedValue)?.name
              : "Select Department"}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className='w-[--radix-popover-trigger-width] p-0'
          align='start'
        >
          {/* shouldFilter=false — we filter manually so spaces work correctly */}
          <Command shouldFilter={false}>
            <CommandInput
              placeholder='Search or create department...'
              className='h-9 text-slate-900 placeholder:text-slate-400'
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {filtered.length === 0 && !showCreate && (
                <CommandEmpty>No departments found.</CommandEmpty>
              )}
              <CommandGroup>
                {filtered.map((dept) => (
                  <CommandItem
                    key={dept.id}
                    value={dept.id}
                    onSelect={() => {
                      form.setValue("departmentId", dept.id, {
                        shouldValidate: true,
                      });
                      setSearch("");
                      setOpen(false);
                    }}
                    className='cursor-pointer'
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === dept.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {dept.name}
                  </CommandItem>
                ))}
              </CommandGroup>

              {showCreate && (
                <CommandGroup>
                  <CommandItem
                    value='__create__'
                    onSelect={handleCreate}
                    disabled={isCreating}
                    className='cursor-pointer text-[#253585] font-medium border-t border-slate-100'
                  >
                    {isCreating ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Plus className='mr-2 h-4 w-4' />
                    )}
                    Create "{trimmed}"
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
