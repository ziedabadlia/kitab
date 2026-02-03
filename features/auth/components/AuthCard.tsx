import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import logo from "@/public/logo.svg";

const AuthCard = ({
  title,
  description,
  children,
  classes,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  classes?: string;
}) => {
  return (
    <Card
      className={`bg-linear-to-b from-[#12141D] to-[#12141D] border-none p-4 md:p-5 w-[95%] lg:w-[90%] ${classes}`}
    >
      <CardHeader className='gap-2 md:gap-4 p-4 md:p-6'>
        <CardTitle className='flex items-center gap-2'>
          <Image
            src={logo}
            height={32}
            width={26}
            alt='logo'
            className='h-8 w-auto'
          />
          <h2 className='text-white font-semibold text-xl md:text-2xl leading-tight'>
            KITAB
          </h2>
        </CardTitle>
        <CardDescription className='space-y-1'>
          <h3 className='text-white font-semibold text-xl md:text-2xl leading-tight'>
            {title}
          </h3>
          <p className='text-[#D6E0FF] font-normal text-xs md:text-base leading-snug mt-1'>
            {description}
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AuthCard;
