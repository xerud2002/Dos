'use client';

import { useState } from 'react';
import StarRatingInput from './StarRatingInput';

interface ReviewFormProps {
  onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [nume, setNume] = useState('');
  const [telefon, setTelefon] = useState('');
  const [rating, setRating] = useState(0);
  const [recenzie, setRecenzie] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        body: JSON.stringify({ nume, telefon, rating, recenzie }),
      });

      if (response.ok) {
        alert('Recenzia ta a fost trimisă cu succes!');
        setNume('');
        setTelefon('');
        setRating(0);
        setRecenzie('');
        onSuccess?.();
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

  return (
    <form onSubmit={handleSubmit} className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-sky-400/20 to-violet-400/20 rounded-bl-full" />
      
      <div className="relative space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="nume" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs">1</span>
              Nume furnizor / companie
            </label>
            <input
              type="text"
              id="nume"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              required
              className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 input-focus transition-all"
              placeholder="Ex: EuroTrans SRL"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="telefon" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs">2</span>
              Telefon furnizor
            </label>
            <input
              type="tel"
              id="telefon"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              required
              className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 input-focus transition-all"
              placeholder="Ex: +40712345678"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs">3</span>
            Selectează rating
          </label>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600">
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="recenzie" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs">4</span>
            Recenzia ta
          </label>
          <textarea
            id="recenzie"
            value={recenzie}
            onChange={(e) => setRecenzie(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 input-focus transition-all resize-none"
            placeholder="Descrie experiența ta cu acest furnizor..."
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Se trimite...
            </>
          ) : (
            <>
              Trimite recenzia
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
