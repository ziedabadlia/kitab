"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useProfilePicture } from "../hooks/useProfilePicture";

interface Props {
  userId: string;
  currentUrl: string | null;
  name: string;
}

export default function ProfilePicture({ userId, currentUrl, name }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useProfilePicture(userId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await upload(file);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className='relative group'>
      <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-[#E7C9A5] bg-[#A3E635]'>
        {currentUrl ? (
          <Image
            src={currentUrl}
            alt={name}
            width={96}
            height={96}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-[#05070A] font-bold text-2xl'>
            {initials}
          </div>
        )}
      </div>

      {/* Upload overlay */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className='absolute inset-0 rounded-full bg-black/50 flex items-center justify-center 
                   opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50'
      >
        <Camera className='w-6 h-6 text-white' />
      </button>

      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
      />

      {isUploading && (
        <div className='absolute inset-0 rounded-full bg-black/50 flex items-center justify-center'>
          <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
        </div>
      )}
    </div>
  );
}
