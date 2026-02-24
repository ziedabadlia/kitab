import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAvatarColor, getInitials } from "@/lib/utils/avatar";

export function BorrowerCell({
  name,
  avatar,
}: {
  name: string;
  avatar: string | null;
}) {
  return (
    <div className='flex items-center gap-3'>
      <div
        className={cn(
          /* Restored exact original classes: w-10, h-10, font-medium, text-xs, border */
          "w-10 h-10 rounded-full overflow-hidden relative flex items-center justify-center text-white font-medium text-xs border border-white",
          avatar ? "bg-slate-200" : getAvatarColor(name),
        )}
      >
        {avatar ? (
          <Image src={avatar} alt={name} fill className='object-cover' />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {/* Restored exact original span styling */}
      <span className='font-medium text-slate-700'>{name}</span>
    </div>
  );
}
