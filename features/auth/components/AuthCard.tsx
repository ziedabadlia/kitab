import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import logo from "../../../public/logo.svg";

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
      className={`bg-linear-to-b from-[#12141D] to-[#12141D] border-none p-5 px-2 md:p-10 w-[90%] ${classes}`}
    >
      <CardHeader className='gap-4 md:gap-8'>
        <CardTitle className='flex items-center gap-2'>
          <Image src={logo} height={40} width={32} alt='logo' />
          <h2 className='text-white font-semibold text-2xl md:text-3xl leading-6'>
            KITAB
          </h2>
        </CardTitle>
        <CardDescription>
          <h3 className='text-white font-semibold text-2xl md:text-3xl leading-8'>
            {title}
          </h3>
          <p className='text-[#D6E0FF] font-normal text-sm md:text-[18px] leading-7 mt-3'>
            {description}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AuthCard;
