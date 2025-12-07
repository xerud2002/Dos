'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import ReviewCard from './ReviewCard';
import { RecenzieWithFurnizor } from '@/types';

interface RecentReviewsProps {
  refreshTrigger?: number;
}

export default function RecentReviews({ refreshTrigger }: RecentReviewsProps) {
  const [reviews, setReviews] = useState<RecenzieWithFurnizor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      if (!db) return;
      
      setLoading(true);
      try {
        const furnizoriSnapshot = await getDocs(collection(db, 'furnizori'));
        const allReviews: RecenzieWithFurnizor[] = [];

        for (const furnizorDoc of furnizoriSnapshot.docs) {
          const furnizorData = furnizorDoc.data();
          const recenziiRef = collection(furnizorDoc.ref, 'recenzii');
          const recenziiSnapshot = await getDocs(recenziiRef);

          recenziiSnapshot.forEach((doc) => {
            const rec = doc.data();
            allReviews.push({
              id: doc.id,
              nume_furnizor: furnizorData.nume || 'Anonim',
              telefon: furnizorData.telefon || '',
              mesaj: rec.mesaj,
              rating: typeof rec.rating === 'number' ? rec.rating : 0,
              data: rec.data,
              timestamp: rec.timestamp?.toDate?.() || new Date(rec.data || 0),
            });
          });
        }

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
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
        Nu există recenzii încă. Fii primul care adaugă o recenzie!
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
