import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAvatarColor, getInitials } from "@/lib/utils/avatar";
import { Avatar } from "@/components/Avatar";

export function BorrowerCell({
  name,
  avatar,
}: {
  name: string;
  avatar: string | null;
}) {
  return (
    <div className='flex items-center gap-3'>
      <Avatar name={name} imageUrl={avatar} />
      <span className='font-medium text-slate-700'>{name}</span>
    </div>
  );
}
