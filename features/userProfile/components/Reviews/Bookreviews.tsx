"use client";

import { PenLine, BookOpen } from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import ReviewsSummary from "./ReviewsSummary";
import { ReviewsData } from "../../types";
import { useReviews } from "../../hooks/useReviews";
import StarRating from "./Starrating";

interface BookReviewsProps {
  bookId: string;
  initialData: ReviewsData;
}

export default function BookReviews({ bookId, initialData }: BookReviewsProps) {
  const {
    data,
    isPending,
    rating,
    comment,
    showForm,
    setRating,
    setComment,
    setShowForm,
    handleSubmit,
  } = useReviews(bookId, initialData);

  return (
    <section className='space-y-8'>
      {/* Section header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-white'>Reader Reviews</h2>
          {data.totalCount > 0 && (
            <div className='flex items-center gap-2 mt-1'>
              <StarRating rating={Math.round(data.averageRating)} size='sm' />
              <span className='text-slate-400 text-sm'>
                {data.averageRating.toFixed(1)} · {data.totalCount}{" "}
                {data.totalCount === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>

        {/* CTA button */}
        {data.canReview && !data.hasReviewed && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2 px-5 py-2.5 bg-[#E7C9A5]/10 border border-[#E7C9A5]/20 text-[#E7C9A5] rounded-xl text-sm font-semibold hover:bg-[#E7C9A5]/20 transition-all'
          >
            <PenLine className='w-4 h-4' />
            Write a Review
          </button>
        )}
      </div>

      {/* Summary bar chart — only show if there are reviews */}
      {data.totalCount > 0 && (
        <ReviewsSummary
          reviews={data.reviews}
          averageRating={data.averageRating}
          totalCount={data.totalCount}
        />
      )}

      {/* Review form */}
      {showForm && data.canReview && !data.hasReviewed && (
        <ReviewForm
          rating={rating}
          comment={comment}
          isPending={isPending}
          onRatingChange={setRating}
          onCommentChange={setComment}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Already reviewed notice */}
      {data.hasReviewed && (
        <div className='flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20'>
          <PenLine className='w-4 h-4 text-emerald-400 shrink-0' />
          <p className='text-emerald-400 text-sm'>
            You have already reviewed this book.
          </p>
        </div>
      )}

      {/* Not eligible notice */}
      {!data.canReview && (
        <div className='flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700'>
          <BookOpen className='w-4 h-4 text-slate-500 shrink-0' />
          <p className='text-slate-500 text-sm'>
            Only students who have read and returned this book can leave a
            review.
          </p>
        </div>
      )}

      {/* Reviews list */}
      {data.reviews.length > 0 ? (
        <div className='space-y-4'>
          {data.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-slate-500'>
            No reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </section>
  );
}
