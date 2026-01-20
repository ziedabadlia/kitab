"use client";

import Image from "next/image";
import React from "react";
import authBackgroundImage from "../assets/images/auth-bg.webp";
import noise from "../assets/images/noise.webp";
import booksBackgroundImage from "../assets/images/books-bg.webp";

const AuthBackgroundImage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative w-full min-h-screen overflow-x-hidden bg-white'>
      {/* 1. Global Noise Layer */}
      <Image
        fill
        alt='noise'
        className='object-cover z-10 opacity-10 pointer-events-none'
        src={noise}
      />

      {/* 2. Global Background Image */}
      <Image
        fill
        alt='auth-bg'
        className='object-cover'
        src={authBackgroundImage}
      />

      <div className='grid grid-cols-12 relative z-30 min-h-screen'>
        {/* 3. Left Side: Form/Content Area (6 cols on desktop) */}
        <div className='col-span-12 lg:col-span-6 min-h-screen w-full flex items-center justify-center p-4'>
          {children}
        </div>

        {/* 4. Right Side: Books Image (6 cols on desktop) */}
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
