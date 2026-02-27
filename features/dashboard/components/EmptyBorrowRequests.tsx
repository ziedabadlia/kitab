import noPendingBookSvg from "@/assets/svg/admin/noPendingBooks.svg";
import Image from "next/image";

export function EmptyBorrowRequests() {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <Image
        src={noPendingBookSvg}
        height={144}
        width={193}
        alt='no pending books'
      />
      <p className='text-[16px] text-[#1E293B] font-semibold'>
        No Pending Book Requests
      </p>
      <p className='text-sm text-[#64748B] font-normal mt-1'>
        There are no borrow book requests awaiting your review at this time.
      </p>
    </div>
  );
}
