import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookFormValues } from "../../validation/bookSchema";
import { CategorySelector } from "./CategorySelector";
import { DepartmentSelector } from "./DepartmentSelector";

interface Props {
  form: UseFormReturn<BookFormValues>;
  departments: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export function BookInfoFields({ form, departments, categories }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className='flex flex-col h-full gap-6'>
      <div>
        <h3 className='text-lg font-semibold text-slate-800 border-b pb-2'>
          Book Information
        </h3>
      </div>

      {/* Title */}
      <div className='space-y-1'>
        <label className='text-sm font-medium text-slate-600'>
          Title <span className='text-red-500'>*</span>
        </label>
        <Input
          {...register("title")}
          placeholder='The Great Gatsby'
          className='bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 font-normal'
        />
        {errors.title && (
          <p className='text-red-500 text-xs'>{errors.title.message}</p>
        )}
      </div>

      {/* Author */}
      <div className='space-y-1'>
        <label className='text-sm font-medium text-slate-600'>
          Author <span className='text-red-500'>*</span>
        </label>
        <Input
          {...register("author")}
          placeholder='F. Scott Fitzgerald'
          className='bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 font-normal'
        />
        {errors.author && (
          <p className='text-red-500 text-xs'>{errors.author.message}</p>
        )}
      </div>

      {/* Dept & Copies Grid */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <DepartmentSelector form={form} departments={departments} />
          {errors.departmentId && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.departmentId.message}
            </p>
          )}
        </div>

        <div className='space-y-1'>
          <label className='text-sm font-medium text-slate-600'>
            Total Copies <span className='text-red-500'>*</span>
          </label>
          <Input
            type='number'
            {...register("totalCopies", { valueAsNumber: true })}
            min={1}
            className='bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 font-normal'
          />
          {errors.totalCopies && (
            <p className='text-red-500 text-xs'>{errors.totalCopies.message}</p>
          )}
        </div>
      </div>

      <CategorySelector form={form} categories={categories} />

      {/* Description */}
      <div className='space-y-1 flex-1 flex flex-col min-h-[150px]'>
        <label className='text-sm font-medium text-slate-600'>
          Summary <span className='text-red-500'>*</span>
        </label>
        <Textarea
          {...register("description")}
          className='flex-1 h-full bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 resize-none'
          placeholder='Write a brief summary of the book...'
        />
        {errors.description && (
          <p className='text-red-500 text-xs'>{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
