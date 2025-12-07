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
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className="text-4xl transition-colors cursor-pointer"
            style={{
              color: star <= displayValue 
                ? ratingColors[displayValue as keyof typeof ratingColors] 
                : '#d1d5db'
            }}
          >
            ★
          </button>
        ))}
      </div>
      {displayValue > 0 && (
        <p 
          className="text-sm font-medium"
          style={{ color: ratingColors[displayValue as keyof typeof ratingColors] }}
        >
          {ratingLabels[displayValue as keyof typeof ratingLabels]}
        </p>
      )}
    </div>
  );
}
