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

const AuthCard = () => {
  return (
    <Card className='bg-linear-to-b from-[#12141D] to-[#12141D] border-none p-10 w-[90%]'>
      <CardHeader className='gap-8'>
        <CardTitle className='flex items-center gap-2'>
          <Image src={logo} height={40} width={32} alt='logo' />
          <h2 className='text-white font-semibold text-3xl leading-6'>KITAB</h2>
        </CardTitle>
        <CardDescription>
          <h3 className='text-white font-semibold text-3xl leading-8'>
            Create Your Library Account
          </h3>
          <p className='text-[#D6E0FF] font-normal text-[18px] leading-7 mt-3'>
            Please complete all fields and upload a valid university ID to gain
            access to the library
          </p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default AuthCard;
