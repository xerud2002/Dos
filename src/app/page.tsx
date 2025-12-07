'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SearchAutocomplete, ReviewForm, RecentReviews } from '@/components';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Modern Redesign */}
      <section className="relative min-h-screen lg:min-h-[90vh] flex items-center overflow-hidden pt-20 lg:pt-0" aria-label="Secțiunea principală">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-slate-950" />
        
        {/* Gradient Orbs - smaller on mobile */}
        <div className="absolute top-10 left-0 w-48 md:w-72 h-48 md:h-72 bg-sky-500/30 rounded-full blur-[80px] md:blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-0 w-64 md:w-96 h-64 md:h-96 bg-violet-500/30 rounded-full blur-[100px] md:blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-linear-to-r from-sky-400/10 to-violet-400/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 md:mb-8">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs md:text-sm text-white/80">Platforma #1 de recenzii din România</span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight">
                <span className="text-white">Descoperă</span>
                <br />
                <span className="bg-linear-to-r from-sky-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  firme de încredere
                </span>
              </h1>
              
              <p className="text-base md:text-xl text-slate-300 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Verifică recenzii reale, evaluează experiențele și ajută comunitatea să găsească cele mai bune 
                <span className="text-sky-400 font-semibold"> firme și PFA-uri </span> 
                din România.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 md:gap-4 mb-8 md:mb-10">
                <a 
                  href="#adauga-recenzie"
                  className="group relative px-8 py-4 bg-linear-to-r from-sky-500 to-violet-500 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/25"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Adaugă recenzie
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a 
                  href="#recenzii"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-bold text-white hover:bg-white/20 transition-all"
                >
                  Vezi recenzii
                </a>
              </div>
              
              {/* Stats Row */}
              <div className="flex gap-8" aria-label="Statistici platformă">
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white">500+</div>
                  <div className="text-sm text-slate-400">Companii</div>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white">2000+</div>
                  <div className="text-sm text-slate-400">Recenzii</div>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white">4.2★</div>
                  <div className="text-sm text-slate-400">Rating mediu</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Search Card */}
            <div className="relative mt-8 lg:mt-0">
              {/* Floating Elements - hidden on mobile for performance */}
              <div className="hidden md:block absolute -top-4 -left-4 w-20 h-20 bg-linear-to-br from-sky-400 to-sky-600 rounded-2xl rotate-12 opacity-80 blur-sm" />
              <div className="hidden md:block absolute -bottom-4 -right-4 w-16 h-16 bg-linear-to-br from-violet-400 to-violet-600 rounded-xl -rotate-12 opacity-80 blur-sm" />
              <div className="hidden lg:block absolute top-1/2 -right-8 w-12 h-12 bg-linear-to-br from-fuchsia-400 to-fuchsia-600 rounded-lg rotate-45 opacity-60 blur-sm" />
              
              {/* Main Card */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 md:p-8 border border-white/20 shadow-2xl">
                <div className="text-center mb-4 md:mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-sky-400 to-violet-500 rounded-xl md:rounded-2xl mb-3 md:mb-4 shadow-lg shadow-violet-500/30">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Caută o firmă</h2>
                  <p className="text-slate-300 text-xs md:text-sm">Găsește recenzii pentru orice firmă sau PFA din România</p>
                </div>
                
                {/* Search Component */}
                <div role="search" aria-label="Caută firme și PFA-uri">
                  <SearchAutocomplete />
                </div>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mt-4 md:mt-6">
                  <span className="px-2 md:px-3 py-1 md:py-1.5 bg-sky-500/20 text-sky-300 rounded-full text-[10px] md:text-xs font-medium border border-sky-500/30">
                    🔍 Căutare rapidă
                  </span>
                  <span className="px-2 md:px-3 py-1 md:py-1.5 bg-amber-500/20 text-amber-300 rounded-full text-[10px] md:text-xs font-medium border border-amber-500/30">
                    ⭐ Recenzii verificate
                  </span>
                  <span className="px-2 md:px-3 py-1 md:py-1.5 bg-violet-500/20 text-violet-300 rounded-full text-[10px] md:text-xs font-medium border border-violet-500/30">
                    💬 Comunitate activă
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-slate-900 to-transparent" />
      </section>

      {/* Review Form Section - Dark Theme */}
      <section className="relative bg-slate-900 py-12 md:py-24 overflow-hidden" id="adauga-recenzie" aria-label="Adaugă o recenzie">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-sky-500/10 rounded-full blur-[100px] md:blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-48 md:w-72 h-48 md:h-72 bg-violet-500/10 rounded-full blur-[80px] md:blur-[100px]" />
        
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm text-white/80">Împărtășește experiența ta</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4">
              Adaugă o{' '}
              <span className="bg-linear-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                recenzie
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base md:text-lg px-4">
              Ajută comunitatea să găsească cele mai bune firme și PFA-uri din România
            </p>
          </div>
          
          {/* Form Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-linear-to-r from-sky-500 to-violet-500 rounded-2xl md:rounded-3xl blur opacity-20" />
            <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-8 border border-white/10">
              <ReviewForm onSuccess={handleReviewSuccess} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-slate-950 py-12 md:py-24 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4">
              De ce{' '}
              <span className="bg-linear-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                daiostea.ro
              </span>
              ?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg px-4">
              Platforma de încredere pentru recenzii în România
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-linear-to-r from-sky-500 to-sky-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-5 md:p-8 border border-white/10 h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-linear-to-br from-sky-400 to-sky-600 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-sky-500/30">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Recenzii Verificate</h3>
                <p className="text-slate-400 text-sm md:text-base">Toate recenziile sunt verificate pentru a asigura autenticitatea și calitatea informațiilor.</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-linear-to-r from-violet-500 to-violet-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-5 md:p-8 border border-white/10 h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-linear-to-br from-violet-400 to-violet-600 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-violet-500/30">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Comunitate Activă</h3>
                <p className="text-slate-400 text-sm md:text-base">O comunitate în creștere de utilizatori care își împărtășesc experiențele zilnic.</p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-linear-to-r from-fuchsia-500 to-fuchsia-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-5 md:p-8 border border-white/10 h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-linear-to-br from-fuchsia-400 to-fuchsia-600 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-fuchsia-500/30">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Rapid și Simplu</h3>
                <p className="text-slate-400 text-sm md:text-base">Găsește rapid informații despre orice firmă sau PFA din România în câteva secunde.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reviews Section - Dark Theme */}
      <section className="relative bg-slate-900 py-12 md:py-24 overflow-hidden" id="recenzii" aria-label="Recenzii recente">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-0 w-64 md:w-96 h-64 md:h-96 bg-violet-500/10 rounded-full blur-[100px] md:blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-48 md:w-72 h-48 md:h-72 bg-sky-500/10 rounded-full blur-[80px] md:blur-[100px]" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
            <div className="text-center md:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 md:mb-6">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs md:text-sm text-white/80">Cele mai recente</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4">
                Recenzii{' '}
                <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  recente
                </span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto md:mx-0">
                Descoperă cele mai noi recenzii lăsate de comunitatea noastră
              </p>
            </div>
            
            <a href="#adauga-recenzie" className="mt-4 md:mt-0 inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-medium text-white hover:bg-white/20 transition-all text-sm md:text-base">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adaugă recenzie
            </a>
          </div>
          
          <RecentReviews refreshTrigger={refreshTrigger} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-slate-950 py-12 md:py-24 overflow-hidden" aria-label="Call to action">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-sky-500/20 via-violet-500/20 to-fuchsia-500/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[200px] md:h-[400px] bg-linear-to-r from-sky-400/30 to-violet-400/30 rounded-full blur-[80px] md:blur-[100px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.5) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 md:mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs md:text-sm text-white/80">Comunitate activă</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6">
            Ai avut o experiență cu{' '}
            <span className="bg-linear-to-r from-sky-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              o firmă
            </span>
            ?
          </h2>
          <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto">
            Recenzia ta poate ajuta mii de oameni să facă alegerea corectă
          </p>
          
          <a 
            href="#adauga-recenzie"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-sky-500 to-violet-500 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/30"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Adaugă recenzie acum
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-950 border-t border-white/10">
        {/* Background */}
        <div className="absolute bottom-0 left-0 w-48 md:w-72 h-48 md:h-72 bg-sky-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-48 md:w-72 h-48 md:h-72 bg-violet-500/5 rounded-full blur-[100px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image 
                  src="/icons/ico-red.png" 
                  alt="daiostea.ro" 
                  width={40} 
                  height={40} 
                  className="w-10 h-10"
                />
                <span className="text-2xl font-black text-white">daiostea.ro</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Platforma #1 de recenzii pentru firme și PFA-uri din România. 
                Ajutăm comunitatea să găsească servicii de încredere.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Linkuri utile</h4>
              <ul className="space-y-3">
                <li><a href="#adauga-recenzie" className="text-slate-400 hover:text-white transition-colors">Adaugă recenzie</a></li>
                <li><a href="#recenzii" className="text-slate-400 hover:text-white transition-colors">Recenzii recente</a></li>
                <li><a href="/politica-confidentialitate" className="text-slate-400 hover:text-white transition-colors">Politica de confidențialitate</a></li>
                <li><a href="/politica-de-stergere-date" className="text-slate-400 hover:text-white transition-colors">Ștergere date</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@daiostea.ro
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  România
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-center md:text-left">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} daiostea.ro. Toate drepturile rezervate.
            </p>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              Făcut cu <span className="text-red-500">❤️</span> în România
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
