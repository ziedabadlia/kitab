import Image from "next/image";
import trashIcon from "@/assets/svg/admin/trashIcon.svg";
import extraIcon from "@/assets/svg/admin/extraIcon.svg";
import { getAvatarColor, getInitials } from "@/lib/utils/avatar";
import { Avatar } from "@/components/Avatar";

interface Props {
  user: any;
  onViewId: (url: string) => void;
  onDelete: (user: any) => void;
}

export const UserRow = ({ user, onViewId, onDelete }: Props) => (
  <tr className='hover:bg-slate-50/50 transition-colors group'>
    <td className='px-6 py-4'>
      <div className='flex items-center gap-3'>
        <Avatar name={user.name} imageUrl={user.image} />
        <div>
          <p className='font-semibold text-[#1E293B]'>{user.name}</p>
          <p className='text-[#64748B] font-normal'>{user.email}</p>
        </div>
      </div>
    </td>
    <td className='px-6 py-4'>{user.dateJoined}</td>
    <td className='px-6 py-4 font-medium text-[#3A354E]'>
      {user.booksBorrowed}
    </td>
    <td className='px-6 py-4 font-medium text-[#3A354E]'>
      {user.universityId}
    </td>
    <td className='px-6 py-4'>
      <button
        onClick={() => onViewId(user.universityCard)}
        className='flex items-center gap-1 text-[#0089F1] font-medium cursor-pointer hover:underline'
      >
        View ID Card <Image src={extraIcon} width={14} height={14} alt='view' />
      </button>
    </td>
    <td className='px-6 py-4'>
      <button
        onClick={() => onDelete(user)}
        className='p-2 hover:bg-red-50 rounded-md transition-colors cursor-pointer'
      >
        <Image src={trashIcon} width={20} height={20} alt='delete' />
      </button>
    </td>
  </tr>
);
