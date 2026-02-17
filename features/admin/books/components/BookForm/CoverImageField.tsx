import { UseFormReturn } from "react-hook-form";
import { ImageIcon, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookFormValues } from "../../validation/bookSchema";

interface Props {
  form: UseFormReturn<BookFormValues>;
  coverPreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CoverImageField({ form, coverPreview, onImageChange }: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const coverColor = watch("coverColor");

  return (
    <div className='space-y-4'>
      <label className='text-sm font-medium text-slate-600'>
        Cover Image <span className='text-red-500'>*</span>
      </label>

      <div className='space-y-3'>
        {/* Upload Zone */}
        <div className='w-full h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 overflow-hidden relative group'>
          {coverPreview ? (
            <>
              <img
                src={coverPreview}
                alt='Cover preview'
                className='h-full w-full object-contain'
              />
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                <label className='cursor-pointer bg-white px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100'>
                  Change Image
                  <input
                    type='file'
                    accept='image/*'
                    onChange={onImageChange}
                    className='hidden'
                  />
                </label>
              </div>
            </>
          ) : (
            <label className='cursor-pointer flex flex-col items-center gap-3 p-8'>
              <div className='p-4 bg-white rounded-full shadow-sm'>
                <ImageIcon className='w-8 h-8 text-[#253585]' />
              </div>
              <div className='text-center'>
                <p className='text-sm font-medium text-slate-600'>
                  Click to upload cover image
                </p>
                <p className='text-xs text-slate-400 mt-1'>
                  Best fit: 600x900px (PNG, JPG, WEBP)
                </p>
              </div>
              <input
                type='file'
                accept='image/*'
                onChange={onImageChange}
                className='hidden'
              />
            </label>
          )}
        </div>

        {/* Small Button fallback */}
        {!coverPreview && (
          <label className='block'>
            <div className='flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors'>
              <UploadCloud className='w-4 h-4 text-slate-600' />
              <span className='text-sm text-slate-600'>Browse Files</span>
            </div>
            <input
              type='file'
              accept='image/*'
              onChange={onImageChange}
              className='hidden'
            />
          </label>
        )}
        {errors.coverImage && (
          <p className='text-red-500 text-xs'>Cover image is required</p>
        )}

        {/* Color Picker */}
        <div className='flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100'>
          <div
            className='w-12 h-12 rounded-lg border-2 border-white shadow-md flex-shrink-0'
            style={{ backgroundColor: coverColor || "#010101" }}
          />
          <div className='flex-1'>
            <p className='text-[10px] uppercase font-bold text-slate-400 tracking-wide'>
              Cover Color
            </p>
            <Input
              {...register("coverColor")}
              placeholder='#010101'
              className='h-7 text-xs font-mono border-none bg-transparent p-0 focus-visible:ring-0 text-slate-900'
            />
            <p className='text-[9px] text-slate-400 mt-0.5'>
              Auto-extracted on upload or customize manually
            </p>
          </div>
        </div>
        {errors.coverColor && (
          <p className='text-red-500 text-xs'>{errors.coverColor.message}</p>
        )}
      </div>
    </div>
  );
}
