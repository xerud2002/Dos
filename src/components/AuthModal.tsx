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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      
      <div 
        className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-500 via-emerald-500 to-cyan-500 rounded-t-2xl" />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'login' && 'Bine ai revenit!'}
              {mode === 'register' && 'Creează un cont gratuit'}
              {mode === 'reset' && 'Îți trimitem un link de resetare'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Social Login Buttons */}
        {mode !== 'reset' && (
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl py-3.5 px-4 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md transition-all group"
            >
              <Image src="/icons/google.svg" alt="Google" width={24} height={24} />
              <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Continuă cu Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white rounded-xl py-3.5 px-4 hover:bg-[#166FE5] hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-medium">Continuă cu Facebook</span>
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-xl py-3.5 px-4 hover:bg-slate-800 hover:shadow-lg transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="font-medium">Continuă cu Apple</span>
            </button>
          </div>
        )}

        {mode !== 'reset' && (
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-slate-400 font-medium">sau cu email</span>
            </div>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Adresa de email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all"
            />
          </div>
          {mode !== 'reset' && (
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="Parolă"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Se procesează...
              </>
            ) : (
              getButtonText()
            )}
          </button>
        </form>

        {/* Mode Switchers */}
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 space-y-2">
          {mode === 'login' && (
            <>
              <p>
                Nu ai cont?{' '}
                <button onClick={() => setMode('register')} className="text-cyan-500 hover:text-cyan-600 font-medium hover:underline">
                  Înregistrează-te gratuit
                </button>
              </p>
              <p>
                <button onClick={() => setMode('reset')} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:underline">
                  Ai uitat parola?
                </button>
              </p>
            </>
          )}
          {mode === 'register' && (
            <p>
              Ai deja cont?{' '}
              <button onClick={() => setMode('login')} className="text-cyan-500 hover:text-cyan-600 font-medium hover:underline">
                Autentifică-te
              </button>
            </p>
          )}
          {mode === 'reset' && (
            <p>
              <button onClick={() => setMode('login')} className="text-cyan-500 hover:text-cyan-600 font-medium hover:underline flex items-center justify-center gap-1 mx-auto">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Înapoi la autentificare
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
