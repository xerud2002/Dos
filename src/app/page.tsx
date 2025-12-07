'use client';

import { useState } from 'react';
import { SearchAutocomplete, ReviewForm, RecentReviews } from '@/components';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-500 mb-4">
          daiostea.ro
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Recenzii autentice pentru servicii de transport în România
        </p>
        <SearchAutocomplete />
      </section>

      {/* Review Form Section */}
      <section className="py-8">
        <ReviewForm onSuccess={handleReviewSuccess} />
      </section>

      {/* Recent Reviews Section */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-cyan-500 mb-6">Recenzii recente</h2>
        <RecentReviews refreshTrigger={refreshTrigger} />
      </section>
    </div>
  );
}
