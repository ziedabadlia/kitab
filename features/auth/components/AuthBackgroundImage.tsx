import Image from "next/image";
import React from "react";
import authBackgroundImage from "../assets/images/auth-bg.webp";
import noise from "../assets/images/noise.webp";
import booksBackgroundImage from "../assets/images/books-bg.webp";

const AuthBackgroundImage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full h-screen'>
      <Image
        fill
        alt='bg-image'
        className='object-cover z-10 opacity-10'
        src={noise}
      />
      <Image
        fill
        alt='bg-image'
        className='object-cover'
        src={authBackgroundImage}
      />
      <div className='grid grid-cols-12'>
        <div className='col-span-full md:col-span-6 z-30 h-screen w-full'>
          <div className='flex items-center justify-center w-full h-screen'>
            {children}
          </div>
        </div>
        <div className='invisible md:visible md:col-span-6 relative h-screen'>
          <Image
            fill
            alt='bg-image'
            className='object-cover z-20 w-full h-full'
            src={booksBackgroundImage}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthBackgroundImage;
