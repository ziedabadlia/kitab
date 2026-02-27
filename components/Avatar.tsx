import Image from "next/image";
import { getInitials, getAvatarColor } from "@/lib/utils/avatar";

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  xs: { container: "w-4 h-4", text: "text-[7px]" },
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-14 h-14", text: "text-base" },
};

export function Avatar({
  name,
  imageUrl,
  size = "md",
  className = "",
}: AvatarProps) {
  const { bg, text, border } = getAvatarColor(name);
  const { container, text: textSize } = sizeMap[size];

  return (
    <div
      className={`
        relative shrink-0 rounded-full overflow-hidden
        flex items-center justify-center font-bold border
        ${container} ${textSize}
        ${imageUrl ? "bg-slate-200 border-slate-300 text-slate-600" : `${bg} ${text} ${border}`}
        ${className}
      `.trim()}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={name} fill className='object-cover' />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
