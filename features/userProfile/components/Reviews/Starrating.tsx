"use client";

import { Star } from "lucide-react";
import { memo, useState } from "react";

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  onRate?: (rating: number) => void;
}

const SIZE = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-6 h-6" };

const StarRating = memo(function StarRating({
  rating,
  interactive = false,
  size = "md",
  onRate,
}: StarRatingProps) {
  // Hover state lives here — never triggers parent re-renders
  const [hovered, setHovered] = useState(0);
  const active = hovered || rating;

  return (
    <div
      className='flex items-center gap-0.5'
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          className={
            interactive
              ? "transition-transform hover:scale-110 active:scale-95"
              : "cursor-default pointer-events-none"
          }
          aria-label={interactive ? `Rate ${star} out of 5` : undefined}
        >
          <Star
            className={`${SIZE[size]} transition-colors ${
              star <= active
                ? "fill-[#E7C9A5] text-[#E7C9A5]"
                : "fill-transparent text-slate-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
});

export default StarRating;
