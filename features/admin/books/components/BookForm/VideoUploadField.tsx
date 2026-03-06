"use client";

import { Film, AlertTriangle, X, Loader2 } from "lucide-react";
import { useRef } from "react";
import { useVideoUpload } from "../../hooks/useVideoUpload";

const MAX_SIZE_MB = 500;
const WARN_SIZE_MB = 100;

interface Props {
  videoFile: File | null;
  initialVideoUrl?: string;
  onVideoChange: (file: File | null) => void;
  onUploadComplete: (url: string) => void;
}

export function VideoUploadField({
  videoFile,
  initialVideoUrl,
  onVideoChange,
  onUploadComplete,
}: Props) {
  const { uploadVideo, progress, isUploading, error, reset } = useVideoUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const sizeWarningRef = useRef<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    sizeWarningRef.current = null;

    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);

    if (sizeMB > MAX_SIZE_MB) {
      sizeWarningRef.current = `File is ${sizeMB.toFixed(0)}MB — max allowed is ${MAX_SIZE_MB}MB.`;
      e.target.value = "";
      return;
    }

    if (sizeMB > WARN_SIZE_MB) {
      sizeWarningRef.current = `Large file (${sizeMB.toFixed(0)}MB) — uploading directly to Cloudinary.`;
    }

    onVideoChange(file);

    try {
      const { url } = await uploadVideo(file);
      console.log("onUploadComplete called with:", url);
      onUploadComplete(url);
    } catch (e) {
      console.error("Upload error caught:", e);
    }
  };

  const handleClear = () => {
    onVideoChange(null);
    reset();
    sizeWarningRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  };

  const hasVideo = videoFile || initialVideoUrl;
  const sizeMB = videoFile ? (videoFile.size / (1024 * 1024)).toFixed(2) : null;

  return (
    <div className='space-y-4'>
      <label className='text-sm font-medium text-slate-600'>
        Presentation Video <span className='text-slate-400'>(Optional)</span>
      </label>

      <div className='space-y-3'>
        {/* Drop zone */}
        <div
          className={`w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
            videoFile
              ? isUploading
                ? "bg-blue-50 border-blue-200"
                : "bg-emerald-50 border-emerald-200"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          {isUploading ? (
            <Loader2 className='w-8 h-8 text-blue-500 animate-spin' />
          ) : (
            <Film
              className={`w-8 h-8 ${videoFile ? "text-emerald-500" : "text-slate-400"}`}
            />
          )}

          {isUploading ? (
            <div className='w-2/3 space-y-2 text-center'>
              <p className='text-sm font-semibold text-blue-700'>
                Uploading to Cloudinary...
              </p>
              <div className='w-full bg-slate-200 rounded-full h-2 overflow-hidden'>
                <div
                  className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${progress ?? 0}%` }}
                />
              </div>
              <p className='text-xs text-slate-500'>{progress ?? 0}%</p>
            </div>
          ) : videoFile ? (
            <div className='text-center space-y-1'>
              <p className='text-sm font-semibold text-emerald-700'>
                ✓ Upload Complete
              </p>
              <p className='text-xs text-slate-600'>{videoFile.name}</p>
              <p className='text-xs text-slate-500'>{sizeMB} MB</p>
            </div>
          ) : initialVideoUrl ? (
            <div className='text-center'>
              <p className='text-sm font-semibold text-slate-700'>
                ✓ Video Already Uploaded
              </p>
              <p className='text-xs text-slate-500 mt-1'>
                Upload new video to replace
              </p>
            </div>
          ) : (
            <p className='text-sm text-slate-500'>No video selected</p>
          )}
        </div>

        {/* Warnings / errors */}
        {(error || sizeWarningRef.current) && (
          <div
            className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border ${
              error
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 shrink-0 mt-0.5 ${error ? "text-red-500" : "text-amber-500"}`}
            />
            <p
              className={`text-xs leading-relaxed ${error ? "text-red-700" : "text-amber-700"}`}
            >
              {error ?? sizeWarningRef.current}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className='flex gap-2'>
          <label className='flex-1 block cursor-pointer'>
            <div
              className={`flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <Film className='w-4 h-4 text-slate-600' />
              <span className='text-sm text-slate-600'>
                {hasVideo ? "Change Video" : "Upload Video"}
              </span>
            </div>
            <input
              ref={inputRef}
              type='file'
              accept='video/*'
              onChange={handleChange}
              disabled={isUploading}
              className='hidden'
            />
          </label>

          {videoFile && !isUploading && (
            <button
              type='button'
              onClick={handleClear}
              className='px-3 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors'
              title='Remove video'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        <p className='text-xs text-slate-400 text-center'>
          MP4, MOV, AVI, WEBM · Max {MAX_SIZE_MB}MB · Uploaded directly to
          Cloudinary
        </p>
      </div>
    </div>
  );
}
