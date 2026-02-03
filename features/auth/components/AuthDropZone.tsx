"use client";

import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { useDropzone, FileRejection, DropzoneOptions } from "react-dropzone";
import {
  ControllerRenderProps,
  UseFormReturn,
  FieldValues,
  Path,
} from "react-hook-form";
import uploadIcon from "@/assets/svgs/upload-icon.svg";

interface FileDropzoneProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  form: UseFormReturn<TFieldValues>;
}

const FileDropzone = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  form,
}: FileDropzoneProps<TFieldValues, TName>) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      field.onChange(acceptedFiles);
      form.clearErrors(field.name);
      form.trigger(field.name);
    },
    [field, form],
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      const error = fileRejections[0]?.errors[0];
      if (!error) return;

      let message = "Invalid file.";
      if (error.code === "file-too-large") message = "Max file size is 5MB.";
      if (error.code === "file-invalid-type")
        message = "Only JPG, PNG, and PDF files are accepted.";

      form.setError(field.name, { type: "manual", message } as any);
    },
    [form, field.name],
  );

  // Define options inside the component to use the callbacks
  const dropzoneOptions: DropzoneOptions = useMemo(
    () => ({
      onDrop,
      onDropRejected,
      accept: {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      maxSize: 5000000,
    }),
    [onDrop, onDropRejected],
  );

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone(dropzoneOptions);

  const files = field.value as File[] | undefined;
  const fileName = files?.[0]?.name;

  return (
    <div
      {...getRootProps()}
      className={`
        py-2.5 px-5 text-center rounded-lg cursor-pointer transition-colors border-2 border-dashed
        ${isDragActive ? "bg-slate-700/50 border-[#E7C9A5]" : "bg-[#232839] border-transparent"}
      `}
    >
      <input {...getInputProps()} />

      {fileName ? (
        <div className='flex items-center justify-center gap-2'>
          <span className='text-indigo-300 text-sm truncate max-w-[200px] italic'>
            {fileName}
          </span>
          <button
            type='button'
            className='text-xs text-red-400 hover:underline font-semibold'
            onClick={(e) => {
              e.stopPropagation();
              field.onChange(undefined);
              form.trigger(field.name);
            }}
          >
            Remove file
          </button>
        </div>
      ) : (
        <div className='gap-2 flex items-center justify-center'>
          <div className='flex justify-center'>
            <Image src={uploadIcon} height={18} width={18} alt='Upload Icon' />
          </div>
          <p className='text-[#D6E0FF] text-[16px] leading-6 font-normal'>
            {isDragActive ? "Drop the file here..." : "Upload a file"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
