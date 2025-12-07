'use client';

import { useState } from 'react';
import { SearchAutocomplete, ReviewForm, RecentReviews } from '@/components';
import Image from 'next/image';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden" aria-label="Secțiunea principală">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-br from-sky-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-linear-to-r from-sky-400/20 to-violet-400/20 rounded-full blur-3xl dark:from-sky-400/10 dark:to-violet-400/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            {/* Logo with glow */}
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-linear-to-r from-sky-400 to-violet-400 blur-2xl opacity-30 rounded-full scale-150" />
              <Image
                src="/icons/ico-red.png"
                alt="daiostea.ro - Platformă recenzii transport"
                width={100}
                height={100}
                className="relative h-24 w-24 mx-auto"
                priority
              />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
              <span className="gradient-text">daiostea.ro</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed font-medium">
              Platformă de recenzii pentru servicii de 
              <span className="font-bold text-sky-600 dark:text-sky-400"> transport </span> 
              în România
            </h2>
            
            <p className="text-base text-slate-500 dark:text-slate-400 mb-10 flex items-center justify-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1">🚚 Verifică</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="inline-flex items-center gap-1">⭐ Evaluează</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="inline-flex items-center gap-1">💬 Împărtășește experiența</span>
            </p>

            {/* Search with enhanced styling */}
            <div className="max-w-2xl mx-auto" role="search" aria-label="Caută furnizori de transport">
              <SearchAutocomplete />
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-16 mt-12" aria-label="Statistici platformă">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">500+</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Furnizori</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">2000+</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Recenzii</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">4.2</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Rating mediu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" aria-hidden="true">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-slate-50 dark:fill-slate-800"/>
          </svg>
        </div>
      </section>

      {/* Review Form Section */}
      <section className="bg-slate-50 dark:bg-slate-800 py-16" id="adauga-recenzie" aria-label="Adaugă o recenzie">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full text-sm font-medium mb-4">
              ✍️ Împărtășește experiența ta
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Adaugă o <span className="gradient-text">recenzie</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Ajută comunitatea să găsească cei mai buni furnizori de transport din România
            </p>
          </div>
          <ReviewForm onSuccess={handleReviewSuccess} />
        </div>
      </section>

      {/* Recent Reviews Section */}
      <section className="py-16 bg-white dark:bg-slate-900" id="recenzii" aria-label="Recenzii recente">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <span className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
                🕐 Cele mai recente
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                Recenzii <span className="gradient-text">recente</span>
              </h2>
            </div>
          </div>
          <RecentReviews refreshTrigger={refreshTrigger} />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative overflow-hidden py-20" aria-label="Call to action">
        <div className="absolute inset-0 animated-gradient opacity-90" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ai avut o experiență cu un furnizor de transport?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Recenzia ta poate ajuta mii de oameni să facă alegerea corectă
          </p>
          <a 
            href="#adauga-recenzie"
            className="inline-block bg-white text-slate-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-xl"
          >
            🚚 Adaugă recenzie acum
          </a>
        </div>
      </section>
    </div>
  );
}
