'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import ReviewCard from './ReviewCard';
import { RecenzieWithFurnizor } from '@/types';

interface RecentReviewsProps {
  refreshTrigger?: number;
}

interface FurnizorStats {
  [furnizorId: string]: {
    totalRating: number;
    count: number;
    avgRating: number;
  };
}

export default function RecentReviews({ refreshTrigger }: RecentReviewsProps) {
  const [reviews, setReviews] = useState<RecenzieWithFurnizor[]>([]);
  const [furnizorStats, setFurnizorStats] = useState<FurnizorStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      if (!db) return;
      
      setLoading(true);
      try {
        const furnizoriSnapshot = await getDocs(collection(db, 'furnizori'));
        const allReviews: RecenzieWithFurnizor[] = [];
        const stats: FurnizorStats = {};

        for (const furnizorDoc of furnizoriSnapshot.docs) {
          const furnizorData = furnizorDoc.data();
          const recenziiRef = collection(furnizorDoc.ref, 'recenzii');
          const recenziiSnapshot = await getDocs(recenziiRef);

          // Calculate stats for this furnizor
          let totalRating = 0;
          let count = 0;

          recenziiSnapshot.forEach((doc) => {
            const rec = doc.data();
            const rating = typeof rec.rating === 'number' ? rec.rating : 0;
            totalRating += rating;
            count++;

            allReviews.push({
              id: doc.id,
              furnizorId: furnizorDoc.id,
              nume_furnizor: furnizorData.nume || 'Anonim',
              telefon: furnizorData.telefon || '',
              mesaj: rec.mesaj,
              rating: rating,
              data: rec.data,
              timestamp: rec.timestamp?.toDate?.() || new Date(rec.data || 0),
            });
          });

          if (count > 0) {
            stats[furnizorDoc.id] = {
              totalRating,
              count,
              avgRating: totalRating / count,
            };
          }
        }

        setFurnizorStats(stats);

        // Sort by timestamp descending and take top 5
        allReviews.sort((a, b) => {
          const dateA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
          const dateB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
          return dateB - dateA;
        });

        setReviews(allReviews.slice(0, 5));
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 animate-pulse">Se încarcă recenziile...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-sky-100 to-violet-100 dark:from-sky-900/30 dark:to-violet-900/30 mb-6">
          <svg className="w-10 h-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          Nu există recenzii încă
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Fii primul care adaugă o recenzie! Experiența ta poate ajuta alți utilizatori să aleagă mai bine.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review, index) => (
        <div 
          key={review.id} 
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
        >
          <ReviewCard 
            review={review} 
            avgRating={review.furnizorId ? furnizorStats[review.furnizorId]?.avgRating : undefined}
            reviewCount={review.furnizorId ? furnizorStats[review.furnizorId]?.count : undefined}
          />
        </div>
      ))}
    </div>
  );
}
