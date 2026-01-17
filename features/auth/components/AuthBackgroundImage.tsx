import Image from "next/image";
import React from "react";
import authBackgroundImage from "../assets/images/auth-bg.webp";
import noise from "../assets/images/noise.webp";
import booksBackgroundImage from "../assets/images/books-bg.webp";

const AuthBackgroundImage = ({ children }: { children: React.ReactNode }) => {
  return (
    /* 1. Use min-h-screen and relative. Removed h-screen to allow growth. */
    <div className='relative w-full min-h-screen overflow-x-hidden'>
      {/* Noise Overlay - ensures it covers the full dynamic height */}
      <Image
        fill
        alt='noise'
        className='object-cover z-10 opacity-10 pointer-events-none'
        src={noise}
      />

      {/* Primary Background */}
      <Image
        fill
        alt='auth-bg'
        className='object-cover'
        src={authBackgroundImage}
      />

      <div className='grid grid-cols-12 relative z-30 min-h-screen'>
        {/* Left Column (Content/Form) */}
        {/* 2. Use min-h-screen here as well so children can be centered vertically */}
        <div className='col-span-full lg:col-span-6 min-h-screen w-full flex items-center justify-center p-4 py-10'>
          {children}
        </div>

        {/* Right Column (Illustration) */}
        {/* 3. hidden md:block is cleaner for responsiveness than invisible */}
        <div className='hidden lg:block lg:col-span-6 relative'>
          <Image
            fill
            alt='books-bg'
            className='object-cover z-20 w-full h-full'
            src={booksBackgroundImage}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthBackgroundImage;
