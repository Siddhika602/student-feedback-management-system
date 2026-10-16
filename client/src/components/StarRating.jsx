import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  rating = 0,
  onRatingChange,
  interactive = false,
  size = 'md',
  showText = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const ratingLabels = {
    1: 'Needs Work',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Outstanding',
  };

  const activeRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1.5 select-none">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= activeRating;
          return (
            <button
              type="button"
              key={starValue}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`transition-all duration-150 ${
                interactive
                  ? 'cursor-pointer hover:scale-120 active:scale-95 focus:outline-none'
                  : 'cursor-default pointer-events-none'
              }`}
            >
              <Star
                className={`${starSizes[size]} transition-all duration-150 ${
                  isFilled
                    ? 'fill-[#FBBF24] text-[#FBBF24] drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : 'text-[#3E3E52] fill-transparent stroke-1'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showText && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20 ml-1">
          {ratingLabels[activeRating] || (activeRating > 0 ? `${activeRating}.0` : 'Not rated')}
        </span>
      )}
    </div>
  );
};

export default StarRating;
