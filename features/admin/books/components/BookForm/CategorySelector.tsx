import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookFormValues } from "../../validation/bookSchema";

interface Props {
  form: UseFormReturn<BookFormValues>;
  categories: { id: string; name: string }[];
}

export function CategorySelector({ form, categories }: Props) {
  const [open, setOpen] = useState(false);
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const selectedCategoryIds = watch("categoryIds") || [];
  const selectedCategories = categories.filter((cat) =>
    selectedCategoryIds.includes(cat.id),
  );

  const toggleCategory = (categoryId: string) => {
    const newIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    setValue("categoryIds", newIds, { shouldValidate: true });
  };

  const removeCategory = (categoryId: string) => {
    setValue(
      "categoryIds",
      selectedCategoryIds.filter((id) => id !== categoryId),
      { shouldValidate: true },
    );
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-slate-600'>
        Categories <span className='text-red-500'>*</span>
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role='combobox'
            aria-expanded={open}
            tabIndex={0}
            className={cn(
              "flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm cursor-pointer hover:bg-slate-100",
            )}
          >
            <div className='flex flex-wrap gap-1 flex-1'>
              {selectedCategories.length > 0 ? (
                selectedCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant='secondary'
                    className='bg-[#253585] text-white hover:bg-blue-900'
                  >
                    {category.name}
                    <button
                      type='button'
                      className='ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeCategory(category.id);
                      }}
                    >
                      <X className='h-3 w-3 text-white hover:text-slate-200' />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className='text-slate-500 text-sm'>
                  Select categories...
                </span>
              )}
            </div>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-[400px] p-0' align='start'>
          <Command>
            <CommandInput placeholder='Search categories...' />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup className='max-h-64 overflow-auto'>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => toggleCategory(category.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategoryIds.includes(category.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {errors.categoryIds && (
        <p className='text-red-500 text-xs'>{errors.categoryIds.message}</p>
      )}
    </div>
  );
}
