'use client';

import Image from 'next/image';
import { getRatingColor, getRatingIconName } from '@/lib/utils/rating';
import { Recenzie } from '@/types';

interface ReviewCardProps {
  review: Recenzie & { nume_furnizor?: string };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const rating = Math.round(review.rating);
  const ratingColor = getRatingColor(review.rating);
  const iconName = getRatingIconName(review.rating);

  const formattedDate = review.data 
    ? new Date(review.data).toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  // Generate stars
  const stars = Array(rating).fill(null);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md transition-shadow hover:shadow-lg"
      style={{ boxShadow: `0 0 2px 1px ${ratingColor}` }}
    >
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {review.nume_furnizor || 'Anonim'}
      </h4>
      
      <div className="flex items-center gap-1 mb-3">
        {stars.map((_, index) => (
          <Image
            key={index}
            src={`/icons/${iconName}`}
            alt="star"
            width={24}
            height={24}
          />
        ))}
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-3">
        {review.mesaj}
      </p>

      <small className="text-gray-500 dark:text-gray-400">
        Postată pe {formattedDate}
      </small>
    </div>
  );
}
