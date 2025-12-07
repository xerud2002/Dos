'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getRatingColor, getRatingIconName, getRatingLabel } from '@/lib/utils/rating';
import { Recenzie } from '@/types';

interface ReviewCardProps {
  review: Recenzie & { nume_furnizor?: string; furnizorId?: string };
  avgRating?: number;
  reviewCount?: number;
}

export default function ReviewCard({ review, avgRating, reviewCount }: ReviewCardProps) {
  // Use avgRating if provided, otherwise fall back to individual review rating
  const displayRating = avgRating ?? review.rating;
  // Round to nearest 0.1
  const roundedRating = Math.round(displayRating * 10) / 10;
  const rating = Math.round(roundedRating);
  const ratingColor = getRatingColor(roundedRating);
  const iconName = getRatingIconName(roundedRating);
  const ratingLabel = getRatingLabel(roundedRating);

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
      className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 overflow-hidden transition-all hover:border-white/20 h-full flex flex-col"
      style={{ 
        boxShadow: `0 4px 30px -4px ${ratingColor}20`,
        minHeight: '220px',
      }}
    >
      {/* Left border accent */}
      <div 
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl md:rounded-l-2xl"
        style={{ background: `linear-gradient(180deg, ${ratingColor}, ${ratingColor}50)` }}
      />
      
      {/* Decorative gradient */}
      <div 
        className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ background: `linear-gradient(135deg, ${ratingColor}, transparent)` }}
      />

      <div className="relative flex flex-col flex-1">
        {/* Header with name and rating */}
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div>
            <h4 className="text-base md:text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
              {review.nume_furnizor || 'Anonim'}
            </h4>
            <span 
              className="inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium border"
              style={{ backgroundColor: `${ratingColor}15`, color: ratingColor, borderColor: `${ratingColor}30` }}
            >
              {ratingLabel}
            </span>
          </div>
          <div className="text-right">
            <div 
              className="text-xl md:text-2xl font-black"
              style={{ color: ratingColor }}
            >
              {roundedRating.toFixed(1)}
            </div>
            {reviewCount && reviewCount > 1 && (
              <div className="text-xs text-slate-400 mt-0.5">
                {reviewCount} recenzii
              </div>
            )}
          </div>
        </div>
        
        {/* Stars */}
        <div className="flex items-center gap-0.5 md:gap-1 mb-3 md:mb-4">
          {stars.map((_, index) => (
            <Image
              key={index}
              src={`/icons/${iconName}`}
              alt="star"
              width={18}
              height={18}
              className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110"
              style={{ transitionDelay: `${index * 50}ms` }}
            />
          ))}
          {emptyStars.map((_, index) => (
            <Image
              key={`empty-${index}`}
              src="/icons/ico-gray.png"
              alt="empty star"
              width={18}
              height={18}
              className="w-4 h-4 md:w-5 md:h-5 opacity-30"
            />
          ))}
        </div>

        {/* Review text */}
        <p className="text-sm md:text-base text-slate-300 mb-3 md:mb-4 leading-relaxed line-clamp-2 flex-1">
          &ldquo;{review.mesaj}&rdquo;
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500">
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </div>
          {review.furnizorId && (
            <Link 
              href={`/profil/${review.furnizorId}`}
              className="text-xs md:text-sm text-sky-400 hover:text-sky-300 font-medium md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center gap-1"
            >
              Vezi profil
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
