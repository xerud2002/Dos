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
    <form onSubmit={handleSubmit} className="relative space-y-4 md:space-y-6">
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <label htmlFor="nume" className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <span className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-lg bg-sky-500/20 text-sky-400 text-xs border border-sky-500/30">1</span>
            Nume furnizor / companie
          </label>
          <input
            type="text"
            id="nume"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            required
            className="w-full px-3 md:px-4 py-3 md:py-3.5 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all text-sm md:text-base"
            placeholder="Ex: EuroTrans SRL"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="telefon" className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <span className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-lg bg-sky-500/20 text-sky-400 text-xs border border-sky-500/30">2</span>
            Telefon furnizor
          </label>
          <input
            type="tel"
            id="telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            required
            className="w-full px-3 md:px-4 py-3 md:py-3.5 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all text-sm md:text-base"
            placeholder="Ex: +40712345678"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <span className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-lg bg-violet-500/20 text-violet-400 text-xs border border-violet-500/30">3</span>
          Selectează rating
        </label>
        <div className="p-3 md:p-4 bg-white/5 rounded-xl border border-white/10">
          <StarRatingInput value={rating} onChange={setRating} />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="recenzie" className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <span className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 text-xs border border-fuchsia-500/30">4</span>
          Recenzia ta
        </label>
        <textarea
          id="recenzie"
          value={recenzie}
          onChange={(e) => setRecenzie(e.target.value)}
          required
          rows={4}
          className="w-full px-3 md:px-4 py-3 md:py-3.5 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none text-sm md:text-base"
          placeholder="Descrie experiența ta cu acest furnizor..."
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full py-3.5 md:py-4 bg-linear-to-r from-sky-500 to-violet-500 rounded-xl font-bold text-base md:text-lg text-white overflow-hidden transition-all hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
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
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-linear-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </form>
  );
}
