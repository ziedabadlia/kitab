import Image from "next/image";
import { Session } from "next-auth";
import { logout } from "@/features/auth/actions/logout";
import logOutSvg from "@/assets/svg/admin/logout.svg";
import { getAvatarColor, getInitials } from "@/lib/utils/avatar";
import { Avatar } from "../Avatar";

export const AdminProfile = ({ session }: { session: Session }) => {
  const userName = session.user?.name || "Admin User";
  const userEmail = session.user?.email || "";
  const profilePic = session.user?.profilePictureUrl;

  return (
    <div className='mt-auto p-2 bg-slate-50/50 rounded-2xl border-2 border-[#EDF1F1] flex items-center justify-between shadow-xs'>
      <div className='flex items-center gap-3 overflow-hidden'>
        <div className='relative shrink-0'>
          <Avatar name={session.user.name} imageUrl={profilePic} />
          {/* Status Indicator */}
          <div className='absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full' />
        </div>

        <div className='flex flex-col overflow-hidden text-left'>
          <p className='text-sm font-bold text-slate-800 truncate'>
            {userName}
          </p>
          <p className='text-xs text-slate-500 truncate'>{userEmail}</p>
        </div>
      </div>

      <form action={logout}>
        <button
          type='submit'
          className='p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer group'
          title='Logout'
        >
          <Image src={logOutSvg} alt='Logout' width={20} height={20} />
        </button>
      </form>
    </div>
  );
};
