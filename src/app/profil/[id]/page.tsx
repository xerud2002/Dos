'use client';

import { useState, useEffect, use } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { ReviewCard } from '@/components';
import { Furnizor, Recenzie } from '@/types';
import { getRatingColor } from '@/lib/utils/rating';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilPage({ params }: PageProps) {
  const { id } = use(params);
  const [furnizor, setFurnizor] = useState<Furnizor | null>(null);
  const [recenzii, setRecenzii] = useState<Recenzie[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!db || !id) return;

      try {
        const furnizorDoc = await getDoc(doc(db, 'furnizori', id));
        
        if (!furnizorDoc.exists()) {
          setLoading(false);
          return;
        }

        const furnizorData = furnizorDoc.data();
        setFurnizor({
          id: furnizorDoc.id,
          nume: furnizorData.nume || '',
          telefon: furnizorData.telefon || '',
          email: furnizorData.email,
          companie: furnizorData.companie,
          creat_la: furnizorData.creat_la,
          claimed: furnizorData.claimed || false,
        });

        // Load reviews
        const recenziiSnapshot = await getDocs(collection(furnizorDoc.ref, 'recenzii'));
        const reviews: Recenzie[] = [];
        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalRating = 0;

        recenziiSnapshot.forEach((doc) => {
          const data = doc.data();
          const rating = data.rating || 0;
          reviews.push({
            id: doc.id,
            mesaj: data.mesaj,
            rating,
            data: data.data,
            timestamp: data.timestamp?.toDate?.(),
          });
          
          const roundedRating = Math.round(rating);
          if (roundedRating >= 1 && roundedRating <= 5) {
            distribution[roundedRating]++;
          }
          totalRating += rating;
        });

        // Sort by date descending
        reviews.sort((a, b) => {
          const dateA = a.timestamp ? a.timestamp.getTime() : new Date(a.data || 0).getTime();
          const dateB = b.timestamp ? b.timestamp.getTime() : new Date(b.data || 0).getTime();
          return dateB - dateA;
        });

        setRecenzii(reviews);
        setRatingDistribution(distribution);
        setAverageRating(reviews.length > 0 ? totalRating / reviews.length : 0);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!furnizor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Profil negăsit
        </h1>
        <Link href="/" className="text-emerald-500 hover:underline">
          Înapoi la pagina principală
        </Link>
      </div>
    );
  }

  const totalReviews = recenzii.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Company Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {furnizor.nume || furnizor.companie || 'Companie'}
        </h1>
        <div className="flex items-center gap-4 mb-4">
          <span 
            className="text-2xl font-bold"
            style={{ color: getRatingColor(averageRating) }}
          >
            {averageRating.toFixed(1)}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="text-2xl"
                style={{
                  color: star <= Math.round(averageRating) 
                    ? getRatingColor(averageRating) 
                    : '#d1d5db'
                }}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-gray-500 dark:text-gray-400">
            ({totalReviews} recenzii)
          </span>
        </div>
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
          furnizor.claimed 
            ? 'bg-emerald-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
          {furnizor.claimed ? 'Profil verificat ✓' : 'Profil nerevendicat ❌'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Info */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informații companie
            </h3>
            {furnizor.telefon && (
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Telefon:</strong> {furnizor.telefon}
              </p>
            )}
            {furnizor.email && (
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> {furnizor.email}
              </p>
            )}
          </div>

          {/* Rating Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Distribuție rating
            </h3>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3 mb-2">
                  <span className="w-8 text-gray-700 dark:text-gray-300">{rating}</span>
                  <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getRatingColor(rating),
                      }}
                    />
                  </div>
                  <span className="w-8 text-sm text-gray-500 dark:text-gray-400">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Reviews */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Toate recenziile
          </h3>
          {recenzii.length > 0 ? (
            <div className="space-y-4">
              {recenzii.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={{ ...review, nume_furnizor: furnizor.nume }} 
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Nu există recenzii pentru acest furnizor.
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link
          href="/"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Adaugă o recenzie
        </Link>
      </div>
    </div>
  );
}
