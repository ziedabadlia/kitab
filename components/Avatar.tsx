"use client";

import Image from "next/image";
import { useState } from "react";
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
  const [imgFailed, setImgFailed] = useState(false);
  const { bg, text, border } = getAvatarColor(name);
  const { container, text: textSize } = sizeMap[size];

  const showImage = !!imageUrl && !imgFailed;

  return (
    <div
      className={`
        relative flex-shrink-0 rounded-full overflow-hidden
        flex items-center justify-center font-bold border
        ${container} ${textSize}
        ${showImage ? "bg-slate-200 border-slate-300 text-slate-600" : `${bg} ${text} ${border}`}
        ${className}
      `.trim()}
    >
      {showImage ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className='object-cover'
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
