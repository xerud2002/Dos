'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';
import { Furnizor } from '@/types';

export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Furnizor[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search providers
  useEffect(() => {
    if (!query.trim() || !db) {
      setResults([]);
      return;
    }

    const searchProviders = async () => {
      setLoading(true);
      try {
        const searchValue = query.toLowerCase();
        const snapshot = await getDocs(collection(db, 'furnizori'));
        const matched: Furnizor[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const nume = (data.nume || '').toLowerCase();
          const companie = (data.companie || '').toLowerCase();
          const telefon = (data.telefon || '').toLowerCase();
          const email = (data.email || '').toLowerCase();

          if (
            nume.includes(searchValue) ||
            companie.includes(searchValue) ||
            telefon.includes(searchValue) ||
            email.includes(searchValue)
          ) {
            matched.push({
              id: doc.id,
              nume: data.nume || '',
              telefon: data.telefon || '',
              email: data.email,
              companie: data.companie,
              creat_la: data.creat_la,
            });
          }
        });

        setResults(matched.slice(0, 8));
        setIsOpen(matched.length > 0);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchProviders, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleSelect = (provider: Furnizor) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/profil/${provider.id}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Subtle border glow on focus */}
        <div className="absolute -inset-px bg-linear-to-r from-sky-500 via-violet-500 to-fuchsia-500 rounded-2xl opacity-0 group-focus-within:opacity-50 transition-opacity duration-300 blur-sm" />
        
        <div className="relative flex items-center bg-slate-800 rounded-2xl border border-slate-700 group-hover:border-slate-600 group-focus-within:border-sky-500/70 transition-all duration-300 shadow-lg">
          {/* Search icon */}
          <div className="absolute left-4 md:left-5 text-slate-400 group-focus-within:text-sky-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Caută firmă sau PFA..."
            className="w-full pl-12 md:pl-14 pr-14 md:pr-16 py-4 text-base bg-transparent text-white placeholder-slate-400 focus:outline-none font-medium"
          />
          
          {/* Loading or search button */}
          <div className="absolute right-2 md:right-3">
            {loading ? (
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <button 
                className="w-10 h-10 flex items-center justify-center bg-linear-to-r from-sky-500 to-violet-500 rounded-xl text-white hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all"
                aria-label="Caută"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-[100] w-full mt-2 bg-slate-800 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 md:px-4 py-2 md:py-3 border-b border-slate-700/50 bg-slate-900/80">
            <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {results.length} rezultate găsite
            </span>
          </div>
          <ul className="max-h-[280px] md:max-h-[320px] overflow-y-auto overscroll-contain touch-pan-y"
              style={{ WebkitOverflowScrolling: 'touch' }}>
            {results.map((provider) => (
              <li
                key={provider.id}
                onClick={() => handleSelect(provider)}
                className="px-3 md:px-4 py-2.5 md:py-3 cursor-pointer hover:bg-slate-700/50 active:bg-slate-700/70 border-b border-slate-700/30 last:border-0 transition-all group/item"
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-linear-to-br from-sky-400 to-violet-500 flex items-center justify-center text-white text-sm md:text-base font-bold shadow-lg">
                    {(provider.nume || provider.companie || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm md:text-base text-white truncate group-hover/item:text-sky-400 transition-colors">
                      {provider.nume || provider.companie || provider.telefon || 'Fără nume'}
                    </p>
                    {provider.telefon && (
                      <p className="text-xs md:text-sm text-slate-400 flex items-center gap-1 mt-0.5">
                        <svg className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="truncate">{provider.telefon}</span>
                      </p>
                    )}
                  </div>
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-500 group-hover/item:text-sky-400 group-hover/item:translate-x-1 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
