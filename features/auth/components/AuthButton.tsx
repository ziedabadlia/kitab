import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthButtonProps {
  isSubmitting: boolean;
  isLoadingOptions?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

const AuthButton = ({
  isSubmitting,
  isLoadingOptions = false,
  children,
  className,
  ...props
}: AuthButtonProps) => {
  return (
    <Button
      type='submit'
      disabled={isSubmitting || isLoadingOptions}
      className={`
        w-full py-8 px-8 bg-[#E7C9A5] text-[16px] font-bold leading-6 text-[#14171C] 
        cursor-pointer hover:bg-[#d4b894] transition-colors
        ${className} 
      `}
      {...props}
    >
      {isSubmitting ? (
        <div className='flex items-center justify-center gap-2'>
          <Loader2 className='h-5 w-5 animate-spin' />
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default AuthButton;
