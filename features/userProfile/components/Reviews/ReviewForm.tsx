"use client";

import { memo } from "react";
import { Loader2 } from "lucide-react";
import StarRating from "./Starrating";

interface ReviewFormProps {
  rating: number;
  comment: string;
  isPending: boolean;
  onRatingChange: (r: number) => void;
  onCommentChange: (c: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ReviewForm = memo(function ReviewForm({
  rating,
  comment,
  isPending,
  onRatingChange,
  onCommentChange,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  return (
    <div className='bg-[#12141D] rounded-2xl p-6 border border-[#E7C9A5]/20 space-y-5'>
      <h4 className='text-white font-semibold'>Write Your Review</h4>

      {/* Star selector */}
      <div className='space-y-1.5'>
        <p className='text-slate-400 text-sm'>Your rating</p>
        <StarRating
          rating={rating}
          interactive
          size='lg'
          onRate={onRatingChange}
        />
      </div>

      {/* Comment */}
      <div className='space-y-1.5'>
        <p className='text-slate-400 text-sm'>Your review</p>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder='Share your thoughts about this book...'
          rows={4}
          className='w-full bg-[#0F1117] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-[#E7C9A5] outline-none transition-all resize-none'
        />
      </div>

      {/* Actions */}
      <div className='flex gap-3'>
        <button
          onClick={onSubmit}
          disabled={isPending || rating === 0 || !comment.trim()}
          className='flex-1 bg-[#E7C9A5] text-[#05070A] font-bold py-3 rounded-xl hover:bg-[#d4b592] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
        >
          {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
          {isPending ? "Submitting..." : "Submit Review"}
        </button>
        <button
          onClick={onCancel}
          disabled={isPending}
          className='px-5 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all disabled:opacity-50'
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

export default ReviewForm;
