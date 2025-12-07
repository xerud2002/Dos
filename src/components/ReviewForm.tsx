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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-cyan-500 mb-6">Adaugă o recenzie</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="nume" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nume furnizor / companie
          </label>
          <input
            type="text"
            id="nume"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Ex: EuroTrans SRL"
          />
        </div>

        <div>
          <label htmlFor="telefon" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Telefon furnizor
          </label>
          <input
            type="tel"
            id="telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Ex: +40712345678"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Rating
          </label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <div>
          <label htmlFor="recenzie" className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Recenzia ta
          </label>
          <textarea
            id="recenzie"
            value={recenzie}
            onChange={(e) => setRecenzie(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            placeholder="Descrie experiența ta cu acest furnizor..."
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Se trimite...' : 'Trimite recenzia'}
        </button>
      </div>
    </form>
  );
}
