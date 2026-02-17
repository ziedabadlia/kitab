"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookFormValues } from "../../validation/bookSchema";

interface Props {
  form: UseFormReturn<BookFormValues>;
  departments: { id: string; name: string }[];
}

export function DepartmentSelector({ form, departments }: Props) {
  const [open, setOpen] = React.useState(false);
  const selectedValue = form.watch("departmentId");

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
              "w-full justify-between text-slate-900 placeholder:text-slate-400  bg-slate-50 border-slate-200 font-normal h-10 px-3",
              !selectedValue && "text-slate-400",
            )}
          >
            {selectedValue
              ? departments.find((d) => d.id === selectedValue)?.name
              : "Select Department"}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-[--radix-popover-trigger-width] p-0'
          align='start'
        >
          <Command className='border-none'>
            <CommandInput
              placeholder='Search departments...'
              className='h-9 text-slate-900 placeholder:text-slate-400'
            />
            <CommandList>
              <CommandEmpty>No department found.</CommandEmpty>
              <CommandGroup>
                {departments.map((dept) => (
                  <CommandItem
                    key={dept.id}
                    value={dept.name}
                    onSelect={() => {
                      form.setValue("departmentId", dept.id, {
                        shouldValidate: true,
                      });
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
