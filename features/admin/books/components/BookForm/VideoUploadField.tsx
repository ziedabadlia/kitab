import { Film } from "lucide-react";

interface Props {
  videoFile: File | null;
  initialVideoUrl?: string;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function VideoUploadField({
  videoFile,
  initialVideoUrl,
  onVideoChange,
}: Props) {
  return (
    <div className='space-y-4'>
      <label className='text-sm font-medium text-slate-600'>
        Presentation Video (Optional)
      </label>

      <div className='space-y-3'>
        <div
          className={`w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${videoFile ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}
        >
          <Film
            className={`w-8 h-8 ${videoFile ? "text-emerald-500" : "text-slate-400"}`}
          />
          {videoFile ? (
            <div className='text-center'>
              <p className='text-sm font-semibold text-emerald-700'>
                ✓ Video Selected
              </p>
              <p className='text-xs text-slate-600 mt-1'>{videoFile.name}</p>
              <p className='text-xs text-slate-500'>
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
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

        <label className='block'>
          <div className='flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors'>
            <Film className='w-4 h-4 text-slate-600' />
            <span className='text-sm text-slate-600'>
              {videoFile || initialVideoUrl ? "Change Video" : "Upload Video"}
            </span>
          </div>
          <input
            type='file'
            accept='video/*'
            onChange={onVideoChange}
            className='hidden'
          />
        </label>
        <p className='text-xs text-slate-400 text-center'>
          MP4, MOV, AVI, WEBM (max 100MB)
        </p>
      </div>
    </div>
  );
}
