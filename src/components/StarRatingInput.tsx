'use client';

import { useState } from 'react';
import { ratingColors, ratingLabels } from '@/lib/utils/rating';

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
}

export default function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className="relative text-5xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
            style={{
              color: star <= displayValue 
                ? ratingColors[displayValue as keyof typeof ratingColors] 
                : '#e2e8f0',
              textShadow: star <= displayValue 
                ? `0 0 20px ${ratingColors[displayValue as keyof typeof ratingColors]}40`
                : 'none',
              filter: star <= displayValue ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none'
            }}
          >
            ★
          </button>
        ))}
      </div>
      <div className="h-8 flex items-center justify-center">
        {displayValue > 0 && (
          <span 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold animate-in fade-in zoom-in duration-200"
            style={{ 
              backgroundColor: `${ratingColors[displayValue as keyof typeof ratingColors]}15`,
              color: ratingColors[displayValue as keyof typeof ratingColors],
              border: `1px solid ${ratingColors[displayValue as keyof typeof ratingColors]}30`
            }}
          >
            <span className="text-base">
              {displayValue === 1 && '😞'}
              {displayValue === 2 && '😕'}
              {displayValue === 3 && '😐'}
              {displayValue === 4 && '😊'}
              {displayValue === 5 && '🤩'}
            </span>
            {ratingLabels[displayValue as keyof typeof ratingLabels]}
          </span>
        )}
      </div>
    </div>
  );
}
