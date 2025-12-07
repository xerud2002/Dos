'use client';

import Image from 'next/image';
import { getRatingColor, getRatingIconName, getRatingLabel } from '@/lib/utils/rating';
import { Recenzie } from '@/types';

interface ReviewCardProps {
  review: Recenzie & { nume_furnizor?: string };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const rating = Math.round(review.rating);
  const ratingColor = getRatingColor(review.rating);
  const iconName = getRatingIconName(review.rating);
  const ratingLabel = getRatingLabel(review.rating);

  const formattedDate = review.data 
    ? new Date(review.data).toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  // Generate stars
  const stars = Array(rating).fill(null);
  const emptyStars = Array(5 - rating).fill(null);

  return (
    <div 
      className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 card-animate overflow-hidden"
      style={{ 
        boxShadow: `0 4px 20px -4px ${ratingColor}40`,
        borderLeft: `4px solid ${ratingColor}`
      }}
    >
      {/* Decorative gradient */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ background: `linear-gradient(135deg, ${ratingColor}, transparent)` }}
      />

      <div className="relative">
        {/* Header with name and rating */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {review.nume_furnizor || 'Anonim'}
            </h4>
            <span 
              className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${ratingColor}20`, color: ratingColor }}
            >
              {ratingLabel}
            </span>
          </div>
          <div 
            className="text-2xl font-bold"
            style={{ color: ratingColor }}
          >
            {review.rating.toFixed(1)}
          </div>
        </div>
        
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-4">
          {stars.map((_, index) => (
            <Image
              key={index}
              src={`/icons/${iconName}`}
              alt="star"
              width={20}
              height={20}
              className="transition-transform group-hover:scale-110"
              style={{ transitionDelay: `${index * 50}ms` }}
            />
          ))}
          {emptyStars.map((_, index) => (
            <Image
              key={`empty-${index}`}
              src="/icons/ico-gray.png"
              alt="empty star"
              width={20}
              height={20}
              className="opacity-30"
            />
          ))}
        </div>

        {/* Review text */}
        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed line-clamp-3">
          &ldquo;{review.mesaj}&rdquo;
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </div>
          <button className="text-sm text-sky-500 hover:text-sky-600 dark:text-sky-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Vezi profil →
          </button>
        </div>
      </div>
    </div>
  );
}
