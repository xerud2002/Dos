'use client';

import { useState, useEffect, useRef } from 'react';
import { ratingColors, ratingLabels } from '@/lib/utils/rating';
import { db } from '@/lib/firebase/client';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface Furnizor {
  id: string;
  nume: string;
  telefon: string;
  companie?: string;
}

interface ReviewFormProps {
  onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [nume, setNume] = useState('');
  const [telefon, setTelefon] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recenzie, setRecenzie] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Furnizor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedFurnizorId, setSelectedFurnizorId] = useState<string | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayRating = hoverRating || rating;

  // Search for furnizori when typing
  useEffect(() => {
    const searchFurnizori = async () => {
      if (nume.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSearchLoading(true);
      try {
        // Search by nume field - case insensitive search
        const searchTerm = nume.toLowerCase();
        const furnizoriRef = collection(db, 'furnizori');
        const q = query(furnizoriRef, orderBy('nume'), limit(50));
        const snapshot = await getDocs(q);
        
        const results: Furnizor[] = [];
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const furnizorNume = (data.nume || '').toLowerCase();
          const furnizorCompanie = (data.companie || '').toLowerCase();
          
          if (furnizorNume.includes(searchTerm) || furnizorCompanie.includes(searchTerm)) {
            results.push({
              id: doc.id,
              nume: data.nume,
              telefon: data.telefon,
              companie: data.companie,
            });
          }
        });
        
        setSuggestions(results.slice(0, 5));
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error('Error searching furnizori:', err);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounce = setTimeout(searchFurnizori, 300);
    return () => clearTimeout(debounce);
  }, [nume]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectFurnizor = (furnizor: Furnizor) => {
    setNume(furnizor.nume);
    setTelefon(furnizor.telefon);
    setSelectedFurnizorId(furnizor.id);
    setShowSuggestions(false);
  };

  const handleNumeChange = (value: string) => {
    setNume(value);
    setSelectedFurnizorId(null); // Reset selected furnizor when typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Te rugăm să selectezi un rating.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/recenzie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nume, 
          telefon, 
          rating, 
          recenzie,
          furnizorId: selectedFurnizorId // Send furnizor ID if selected from suggestions
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setNume('');
          setTelefon('');
          setRating(0);
          setRecenzie('');
          setSuccess(false);
          setSelectedFurnizorId(null);
          onSuccess?.();
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.mesaj || 'A apărut o eroare la trimiterea recenziei.');
      }
    } catch (err) {
      console.error(err);
      setError('Eroare la trimitere.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl md:rounded-3xl p-8 md:p-12 border border-white/10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center animate-bounce">
          <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Mulțumim!</h3>
        <p className="text-slate-400">Recenzia ta a fost trimisă cu succes.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10">
      {/* Decorative elements */}
      <div className="absolute -top-px left-20 right-20 h-px bg-linear-to-r from-transparent via-sky-500/50 to-transparent" />
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column: Steps 1, 2, 3 */}
        <div className="flex-1 space-y-5">
          {/* Step 1: Name */}
          <div className="group">
            <label htmlFor="nume" className="flex items-center gap-2.5 text-sm font-semibold text-slate-200 mb-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-linear-to-br from-sky-500 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25">1</span>
              Nume furnizor / companie
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                id="nume"
                value={nume}
                onChange={(e) => handleNumeChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                required
                autoComplete="off"
                className={`w-full px-4 py-3.5 pl-11 pr-10 border rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all ${
                  selectedFurnizorId ? 'border-emerald-500/50' : 'border-slate-700'
                }`}
                placeholder="Ex: EuroTrans SRL"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              {/* Loading/Selected indicator */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {searchLoading ? (
                  <svg className="animate-spin w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : selectedFurnizorId ? (
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : null}
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-50 left-0 right-0 top-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl shadow-black/20 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-slate-700/50">
                    <span className="text-xs font-medium text-slate-400">Furnizori găsiți</span>
                  </div>
                  {suggestions.map((furnizor) => (
                    <button
                      key={furnizor.id}
                      type="button"
                      onClick={() => selectFurnizor(furnizor)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700/50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{furnizor.nume}</p>
                        <p className="text-sm text-slate-400 truncate">
                          {furnizor.companie && <span>{furnizor.companie} • </span>}
                          {furnizor.telefon}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedFurnizorId && (
              <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Furnizor selectat din baza de date
              </p>
            )}
          </div>

          {/* Step 2: Phone */}
          <div className="group">
            <label htmlFor="telefon" className="flex items-center gap-2.5 text-sm font-semibold text-slate-200 mb-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-linear-to-br from-violet-500 to-purple-500 text-white text-xs font-bold shadow-lg shadow-violet-500/25">2</span>
              Telefon furnizor
            </label>
            <div className="relative">
              <input
                type="tel"
                id="telefon"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                required
                className="w-full px-4 py-3.5 pl-11 border border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                placeholder="Ex: +40712345678"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Step 3: Rating */}
          <div>
            <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-200 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-linear-to-br from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/25">3</span>
              Selectează rating
            </label>
            <div 
              className="relative p-4 md:p-5 rounded-xl border transition-all duration-300"
              style={{
                backgroundColor: displayRating ? `${ratingColors[displayRating as keyof typeof ratingColors]}08` : 'rgb(15 23 42 / 0.5)',
                borderColor: displayRating ? `${ratingColors[displayRating as keyof typeof ratingColors]}30` : 'rgb(51 65 85)',
              }}
            >
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 md:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="relative p-1 transition-all duration-200 hover:scale-125 active:scale-95"
                  >
                    <span 
                      className="text-3xl md:text-4xl block transition-all duration-200"
                      style={{
                        color: star <= displayRating 
                          ? ratingColors[displayRating as keyof typeof ratingColors] 
                          : '#475569',
                        textShadow: star <= displayRating 
                          ? `0 0 30px ${ratingColors[displayRating as keyof typeof ratingColors]}60`
                          : 'none',
                        transform: star <= displayRating ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>

              {/* Rating Label */}
              <div className="h-9 flex items-center justify-center mt-2">
                {displayRating > 0 && (
                  <span 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold animate-in fade-in zoom-in-95 duration-200"
                    style={{ 
                      backgroundColor: `${ratingColors[displayRating as keyof typeof ratingColors]}20`,
                      color: ratingColors[displayRating as keyof typeof ratingColors],
                      boxShadow: `0 0 20px ${ratingColors[displayRating as keyof typeof ratingColors]}20`
                    }}
                  >
                    <span className="text-base">
                      {displayRating === 1 && '😞'}
                      {displayRating === 2 && '😕'}
                      {displayRating === 3 && '😐'}
                      {displayRating === 4 && '😊'}
                      {displayRating === 5 && '🤩'}
                    </span>
                    {ratingLabels[displayRating as keyof typeof ratingLabels]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-px bg-slate-700/50 self-stretch" />
        
        {/* Horizontal Divider for mobile */}
        <div className="lg:hidden h-px bg-slate-700/50" />

        {/* Right Column: Step 4 */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="recenzie" className="flex items-center gap-2.5 text-sm font-semibold text-slate-200 mb-2.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-linear-to-br from-fuchsia-500 to-pink-500 text-white text-xs font-bold shadow-lg shadow-fuchsia-500/25">4</span>
            Recenzia ta
          </label>
          <div className="relative flex-1">
            <textarea
              id="recenzie"
              value={recenzie}
              onChange={(e) => setRecenzie(e.target.value)}
              required
              className="w-full h-full min-h-[200px] lg:min-h-0 px-4 py-3.5 border border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all resize-none"
              placeholder="Descrie experiența ta cu acest furnizor..."
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-600">
              {recenzie.length} caractere
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section: Error and Submit */}
      <div className="mt-6 space-y-4">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-in slide-in-from-top-2 duration-200">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full py-4 bg-linear-to-r from-sky-500 via-violet-500 to-fuchsia-500 rounded-xl font-bold text-lg text-white overflow-hidden transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-linear-to-r from-fuchsia-500 via-violet-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </div>
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Se trimite recenzia...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Trimite recenzia
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
        </button>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Recenzie verificată
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            100% anonim
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Ajută comunitatea
          </span>
        </div>
      </div>
    </form>
  );
}
