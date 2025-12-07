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
        {/* Glow effect behind input */}
        <div className="absolute -inset-1 bg-linear-to-r from-sky-400 to-violet-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
        
        <div className="relative flex items-center">
          {/* Search icon */}
          <div className="absolute left-5 text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Caută furnizor după nume, telefon sau email..."
            className="w-full pl-14 pr-14 py-5 text-lg border-2 border-slate-200 dark:border-slate-600 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 transition-all"
          />
          
          {/* Loading or search button */}
          <div className="absolute right-3">
            {loading ? (
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <button className="w-10 h-10 flex items-center justify-center bg-linear-to-r from-sky-500 to-violet-500 rounded-full text-white hover:shadow-lg hover:scale-105 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {results.length} rezultate găsite
            </span>
          </div>
          {results.map((provider, index) => (
            <li
              key={provider.id}
              onClick={() => handleSelect(provider)}
              className="px-5 py-4 cursor-pointer hover:bg-linear-to-r hover:from-sky-50 hover:to-violet-50 dark:hover:from-slate-700 dark:hover:to-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-all group/item"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-sky-400 to-violet-400 flex items-center justify-center text-white font-bold">
                  {(provider.nume || provider.companie || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white truncate group-hover/item:text-sky-600 dark:group-hover/item:text-sky-400 transition-colors">
                    {provider.nume || provider.companie || provider.telefon || 'Fără nume'}
                  </p>
                  {provider.telefon && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {provider.telefon}
                    </p>
                  )}
                </div>
                <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover/item:text-sky-500 group-hover/item:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
