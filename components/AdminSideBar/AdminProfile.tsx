import Image from "next/image";
import { Session } from "next-auth";
import { logout } from "@/features/auth/actions/logout";
import logOutSvg from "@/assets/svg/admin/logout.svg";

export const AdminProfile = ({ session }: { session: Session }) => (
  <div className='mt-auto p-2 bg-slate-50/50 rounded-2xl border-2 border-[#EDF1F1] flex items-center justify-between shadow-xs'>
    <div className='flex items-center gap-3 overflow-hidden'>
      <div className='relative shrink-0'>
        <Image
          src={session.user?.profilePictureUrl || "/default-avatar.png"}
          alt='Avatar'
          width={40}
          height={40}
          className='rounded-full object-cover border border-white'
        />
        <div className='absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full' />
      </div>
      <div className='flex flex-col overflow-hidden text-left'>
        <p className='text-sm font-bold text-slate-800 truncate'>
          {session.user?.name}
        </p>
        <p className='text-xs text-slate-500 truncate'>{session.user?.email}</p>
      </div>
    </div>
    <form action={logout}>
      <button className='p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer group'>
        <Image src={logOutSvg} alt='Logout' width={20} height={20} />
      </button>
    </form>
  </div>
);
