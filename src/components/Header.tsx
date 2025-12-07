'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import AuthModal from './AuthModal';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <Image 
              src="/icons/ico-red.png" 
              alt="daiostea.ro" 
              width={32} 
              height={32} 
              className="w-7 h-7 md:w-8 md:h-8 transition-transform group-hover:scale-110"
            />
            <span className="text-lg md:text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
              daiostea.ro
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2 md:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 group"
              title={theme === 'light' ? 'Activează modul întunecat' : 'Activează modul luminos'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                  <Image
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=8b5cf6&color=fff`}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-violet-400"
                  />
                  <span className="hidden md:inline text-sm font-medium text-slate-200 max-w-[150px] truncate">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all group"
                  title="Logout"
                >
                  <svg className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-linear-to-r from-sky-500 to-violet-500 rounded-xl font-semibold text-white text-sm md:text-base hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-105"
              >
                <span>Autentificare</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
