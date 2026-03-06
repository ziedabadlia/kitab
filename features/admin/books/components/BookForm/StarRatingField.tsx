import { memo, useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { BookFormValues } from "../../validation/bookSchema";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  form: UseFormReturn<BookFormValues>;
}

const StarRatingField = memo(function StarRatingField({ form }: Props) {
  const currentRating = form.watch("rating") ?? 0;
  const [hovered, setHovered] = useState<number>(0);
  const error = form.formState.errors.rating;

  const handleMouseEnter = useCallback((star: number) => {
    setHovered(star);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(0);
  }, []);

  const handleClick = useCallback(
    (star: number) => {
      form.setValue("rating", star, { shouldValidate: true });
    },
    [form],
  );

  const displayRating = hovered || currentRating;

  return (
    <div className='space-y-1'>
      <label className='text-sm font-medium text-slate-600'>
        Rating <span className='text-red-500'>*</span>
      </label>
      <div
        className='flex items-center gap-1'
        onMouseLeave={handleMouseLeave}
        role='group'
        aria-label='Book rating'
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type='button'
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            aria-label={`Rate ${star} out of 5`}
            className='p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
          >
            <Star
              className={cn(
                "w-7 h-7 transition-colors duration-100",
                star <= displayRating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-100 text-slate-300",
              )}
            />
          </button>
        ))}
        {currentRating > 0 && (
          <span className='ml-2 text-sm text-slate-500 font-medium'>
            {currentRating}/5
          </span>
        )}
      </div>
      {error && <p className='text-red-500 text-xs'>{error.message}</p>}
    </div>
  );
});

export default StarRatingField;
