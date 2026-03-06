"use client";

import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookForm } from "../hooks/useBookForm";
import { BookInfoFields } from "./BookForm/BookInfoFields";
import { CoverImageField } from "./BookForm/CoverImageField";
import { VideoUploadField } from "./BookForm/VideoUploadField";

interface Props {
  initialData?: any;
  departments: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onSubmit: (
    data: FormData,
  ) => Promise<{ success: boolean; message?: string; data?: any }>;
}

export function BookForm({
  initialData,
  departments = [],
  categories = [],
  onSubmit,
}: Props) {
  const {
    form,
    uploadError,
    setUploadError,
    coverPreview,
    videoFile,
    handleCoverImageChange,
    handleVideoChange,
    handleVideoUploadComplete,
    handleFormSubmit,
    isVideoUploading,
  } = useBookForm({ initialData, onSubmit });

  const {
    formState: { isSubmitting, isDirty },
  } = form;

  const isEditMode = !!initialData;
  // In edit mode, disable if nothing changed and no new media selected
  const isUnchanged = isEditMode && !isDirty && !videoFile;
  const isDisabled = isSubmitting || isVideoUploading || isUnchanged;

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className='space-y-8 max-w-5xl bg-white p-8 rounded-2xl shadow-sm border border-slate-100'
    >
      {/* Error Alert */}
      {uploadError && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between'>
          <span className='text-sm'>{uploadError}</span>
          <button
            type='button'
            onClick={() => setUploadError(null)}
            className='text-red-500 hover:text-red-700'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        <div className='h-full'>
          <BookInfoFields
            form={form}
            departments={departments}
            categories={categories}
          />
        </div>

        <div className='space-y-6'>
          <h3 className='text-lg font-semibold text-slate-800 border-b pb-2'>
            Book Media
          </h3>
          <CoverImageField
            form={form}
            coverPreview={coverPreview}
            onImageChange={handleCoverImageChange}
          />
          <VideoUploadField
            videoFile={videoFile}
            initialVideoUrl={initialData?.videoUrl}
            onVideoChange={handleVideoChange}
            onUploadComplete={handleVideoUploadComplete}
          />
        </div>
      </div>

      <div className='pt-6 border-t'>
        <Button
          type='submit'
          disabled={isDisabled}
          className='w-full bg-[#253585] hover:bg-blue-900 text-white h-14 rounded-xl text-lg font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isVideoUploading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Waiting for video upload...</span>
            </div>
          ) : isSubmitting ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Saving...</span>
            </div>
          ) : isEditMode ? (
            "Update Book Entry"
          ) : (
            "Publish Book to Library"
          )}
        </Button>
      </div>
    </form>
  );
}
