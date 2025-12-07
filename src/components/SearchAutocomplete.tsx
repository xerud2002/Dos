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
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Caută furnizor după nume, telefon sau email..."
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-lg"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {results.map((provider) => (
            <li
              key={provider.id}
              onClick={() => handleSelect(provider)}
              className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
            >
              <p className="font-medium text-gray-900 dark:text-white">
                {provider.nume || provider.companie || provider.telefon || 'Fără nume'}
              </p>
              {provider.telefon && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{provider.telefon}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
