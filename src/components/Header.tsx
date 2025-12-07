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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md shadow-red-500/20 h-16 flex items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="daiostea.ro logo"
            width={120}
            height={45}
            className="h-11 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={theme === 'light' ? 'Activează modul întunecat' : 'Activează modul luminos'}
          >
            <Image
              src={theme === 'light' ? '/icons/moon.png' : '/icons/sun.png'}
              alt="Toggle theme"
              width={32}
              height={32}
            />
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <Image
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}`}
                alt="Avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="hidden md:inline text-sm text-gray-700 dark:text-gray-300">
                {user.displayName || user.email}
              </span>
              <button
                onClick={logout}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Logout"
              >
                <Image
                  src="/icons/logout.png"
                  alt="Logout"
                  width={32}
                  height={32}
                />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Autentificare
            </button>
          )}
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
