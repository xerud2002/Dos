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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="daiostea.ro logo"
              width={40}
              height={40}
              className="h-9 w-auto transition-transform group-hover:scale-110"
              priority
            />
            <span className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              daiostea.ro
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 group"
              title={theme === 'light' ? 'Activează modul întunecat' : 'Activează modul luminos'}
            >
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              <Image
                src={theme === 'light' ? '/icons/moon.png' : '/icons/sun.png'}
                alt="Toggle theme"
                width={24}
                height={24}
                className="relative transition-transform group-hover:rotate-12"
              />
            </button>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=06b6d4&color=fff`}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-cyan-400"
                  />
                  <span className="hidden md:inline text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[150px] truncate">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all group"
                  title="Logout"
                >
                  <Image
                    src="/icons/logout.png"
                    alt="Logout"
                    width={24}
                    height={24}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-primary flex items-center gap-2"
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
