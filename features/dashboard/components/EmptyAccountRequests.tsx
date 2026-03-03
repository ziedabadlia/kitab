import Image from "next/image";
import noPendingUsersSvg from "@/assets/svg/admin/noPendingUsers.svg"; // Adjust path as needed

export function EmptyAccountRequests() {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <Image
        src={noPendingUsersSvg}
        height={144}
        width={193}
        alt='no pending users'
      />
      <p className='text-[16px] text-[#1E293B] font-semibold mt-4'>
        No Pending Account Requests
      </p>
      <p className='text-sm text-[#64748B] font-normal mt-1 max-w-[280px]'>
        There are currently no account requests awaiting approval.
      </p>
    </div>
  );
}
