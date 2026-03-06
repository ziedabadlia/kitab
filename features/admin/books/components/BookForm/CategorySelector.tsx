"use client";

import * as React from "react";
import { Check, X, Plus, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
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
import { createCategory } from "../../actions/taxonomy";

interface Props {
  form: UseFormReturn<BookFormValues>;
  categories: { id: string; name: string }[];
}

export function CategorySelector({ form, categories }: Props) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [items, setItems] = React.useState(categories);

  const selected: string[] = form.watch("categoryIds") ?? [];
  const trimmed = search.trim();

  // Filter manually so spaces don't confuse Command's built-in filter
  const filtered = search
    ? items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  const exactMatch = items.some(
    (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
  );
  const showCreate = trimmed.length > 0 && !exactMatch;

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    form.setValue("categoryIds", next, { shouldValidate: true });
  };

  const handleCreate = async () => {
    if (!trimmed) return;
    setIsCreating(true);
    try {
      const result = await createCategory(trimmed);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setItems((prev) => [...prev, result]);
      form.setValue("categoryIds", [...selected, result.id], {
        shouldValidate: true,
      });
      setSearch("");
      toast.success(`Category "${result.name}" created.`);
    } catch {
      toast.error("Failed to create category.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-slate-600'>
        Categories <span className='text-red-500'>*</span>
      </label>

      {selected.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {selected.map((id) => {
            const cat = items.find((c) => c.id === id);
            if (!cat) return null;
            return (
              <span
                key={id}
                className='inline-flex items-center gap-1 bg-[#253585]/10 text-[#253585] text-xs font-medium px-2.5 py-1 rounded-full'
              >
                {cat.name}
                <button
                  type='button'
                  onClick={() => toggle(id)}
                  className='hover:text-red-500 transition-colors'
                >
                  <X className='h-3 w-3' />
                </button>
              </span>
            );
          })}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type='button'
            className='w-full h-10 px-3 text-sm text-left bg-slate-50 border border-slate-200 rounded-md text-slate-400 hover:border-slate-300 transition-colors'
          >
            {selected.length > 0
              ? `${selected.length} selected — click to edit`
              : "Select or create categories..."}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className='w-[--radix-popover-trigger-width] p-0'
          align='start'
        >
          {/* shouldFilter=false — we filter manually so spaces work correctly */}
          <Command shouldFilter={false}>
            <CommandInput
              placeholder='Search or create category...'
              className='h-9 text-slate-900 placeholder:text-slate-400'
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {filtered.length === 0 && !showCreate && (
                <CommandEmpty>No categories found.</CommandEmpty>
              )}
              <CommandGroup>
                {filtered.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.id}
                    onSelect={() => toggle(cat.id)}
                    className='cursor-pointer'
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(cat.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {cat.name}
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
