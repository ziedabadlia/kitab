import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone, FileRejection, DropzoneOptions } from "react-dropzone";
import {
  ControllerRenderProps,
  UseFormReturn,
  FieldValues,
  Path,
} from "react-hook-form";
import uploadIcon from "../assets/svgs/uplaod-icon.svg";

// Generic TFieldValues allows this component to work with any form schema
interface FileDropzoneProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  form: UseFormReturn<TFieldValues>;
}

const FileDropzone = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>({
  field,
  form,
}: FileDropzoneProps<TFieldValues, TName>) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Set the value in React Hook Form
      // We use acceptedFiles directly as an array of File objects
      field.onChange(acceptedFiles);
    },
    [field]
  );

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 5000000,
  };

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone(dropzoneOptions);

  // Cast field.value as File[] | undefined to access properties safely
  const files = field.value as File[] | undefined;
  const fileName = files?.[0]?.name;

  return (
    <div
      {...getRootProps()}
      className={`
        py-2.5 px-5 text-center rounded-lg cursor-pointer transition-colors
        ${isDragActive ? " bg-slate-700/50" : " bg-[#232839]"}
      `}
    >
      <input {...getInputProps()} />

      {fileName ? (
        <div className='flex items-center justify-center gap-2'>
          <span className='text-indigo-300 text-sm truncate max-w-full italic'>
            {fileName}
          </span>
          <button
            type='button'
            className='text-xs text-red-400 hover:underline'
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the file dialog
              field.onChange(undefined);
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
            {isDragActive ? "Upload a file here..." : "Upload a file"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
