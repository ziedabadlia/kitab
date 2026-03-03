"use client";

import { memo } from "react";
import { Star } from "lucide-react";
import { ReviewItem } from "../../types";

interface ReviewsSummaryProps {
  reviews: ReviewItem[];
  averageRating: number;
  totalCount: number;
}

const ReviewsSummary = memo(function ReviewsSummary({
  reviews,
  averageRating,
  totalCount,
}: ReviewsSummaryProps) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct:
      totalCount > 0
        ? (reviews.filter((r) => r.rating === star).length / totalCount) * 100
        : 0,
  }));

  return (
    <div className='flex flex-col sm:flex-row gap-6 bg-[#12141D] rounded-2xl p-6 border border-slate-800/60'>
      {/* Average score */}
      <div className='flex flex-col items-center justify-center min-w-[100px]'>
        <span className='text-5xl font-bold text-white'>
          {averageRating.toFixed(1)}
        </span>
        <div className='flex items-center gap-1 mt-1'>
          <Star className='w-4 h-4 fill-[#E7C9A5] text-[#E7C9A5]' />
          <span className='text-slate-400 text-sm'>
            {totalCount} {totalCount === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className='hidden sm:block w-px bg-slate-800' />

      {/* Distribution bars */}
      <div className='flex-1 space-y-2'>
        {distribution.map(({ star, count, pct }) => (
          <div key={star} className='flex items-center gap-3'>
            <span className='text-slate-400 text-xs w-3 shrink-0'>{star}</span>
            <Star className='w-3 h-3 fill-[#E7C9A5] text-[#E7C9A5] shrink-0' />
            <div className='flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden'>
              <div
                className='h-full bg-[#E7C9A5] rounded-full transition-all duration-500'
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className='text-slate-500 text-xs w-4 text-right shrink-0'>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ReviewsSummary;
