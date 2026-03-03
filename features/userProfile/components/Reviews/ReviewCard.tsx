"use client";

import { memo } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { ReviewItem } from "../../types";
import StarRating from "./Starrating";

interface ReviewCardProps {
  review: ReviewItem;
}

const ReviewCard = memo(function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.author.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className='bg-[#12141D] rounded-2xl p-6 border border-slate-800/60 space-y-4'>
      {/* Header */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-3'>
          {review.author.profilePictureUrl ? (
            <Image
              src={review.author.profilePictureUrl}
              alt={review.author.fullName}
              width={40}
              height={40}
              className='rounded-full object-cover w-10 h-10 shrink-0'
            />
          ) : (
            <div className='w-10 h-10 rounded-full bg-[#E7C9A5]/10 border border-[#E7C9A5]/20 flex items-center justify-center shrink-0'>
              <span className='text-[#E7C9A5] text-sm font-bold'>
                {initials}
              </span>
            </div>
          )}
          <div>
            <p className='text-white font-semibold text-sm'>
              {review.author.fullName}
            </p>
            <p className='text-slate-500 text-xs'>
              {format(new Date(review.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        <StarRating rating={review.rating} size='sm' />
      </div>

      {/* Comment */}
      {review.comment && (
        <p className='text-slate-400 text-sm leading-relaxed'>
          {review.comment}
        </p>
      )}
    </div>
  );
});

export default ReviewCard;
