'use client';

import { useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import Image from 'next/image';

type AuthMode = 'login' | 'register' | 'reset';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    if (!auth) return;
    setLoading(true);
    setError('');

    try {
      let authProvider;
      switch (provider) {
        case 'google':
          authProvider = new GoogleAuthProvider();
          break;
        case 'facebook':
          authProvider = new FacebookAuthProvider();
          break;
        case 'apple':
          authProvider = new OAuthProvider('apple.com');
          break;
      }
      await signInWithPopup(auth, authProvider);
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Eroare la autentificare';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        onClose();
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        alert('Email de resetare trimis!');
        setMode('login');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Eroare';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Autentificare';
      case 'register': return 'Creează cont';
      case 'reset': return 'Resetare parolă';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'login': return 'Continuă';
      case 'register': return 'Înregistrează-te';
      case 'reset': return 'Trimite link resetare';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Social Login Buttons */}
        {mode !== 'reset' && (
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Image src="/icons/google.svg" alt="Google" width={24} height={24} />
              <span className="text-gray-700 dark:text-gray-200">Continuă cu Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-700 transition-colors"
            >
              <span className="font-bold text-xl">f</span>
              <span>Continuă cu Facebook</span>
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-lg py-3 px-4 hover:bg-gray-900 transition-colors"
            >
              <span className="font-bold text-xl"></span>
              <span>Continuă cu Apple</span>
            </button>
          </div>
        )}

        {mode !== 'reset' && (
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">sau</span>
            </div>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {mode !== 'reset' && (
            <input
              type="password"
              placeholder="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Se încarcă...' : getButtonText()}
          </button>
        </form>

        {/* Mode Switchers */}
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
          {mode === 'login' && (
            <>
              <p>
                Nu ai cont?{' '}
                <button onClick={() => setMode('register')} className="text-emerald-500 hover:underline">
                  Înregistrează-te
                </button>
              </p>
              <p>
                <button onClick={() => setMode('reset')} className="text-emerald-500 hover:underline">
                  Ai uitat parola?
                </button>
              </p>
            </>
          )}
          {mode === 'register' && (
            <p>
              Ai deja cont?{' '}
              <button onClick={() => setMode('login')} className="text-emerald-500 hover:underline">
                Autentifică-te
              </button>
            </p>
          )}
          {mode === 'reset' && (
            <p>
              <button onClick={() => setMode('login')} className="text-emerald-500 hover:underline">
                Înapoi la autentificare
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
