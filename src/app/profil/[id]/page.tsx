'use client';

import { useState, useEffect, use, useRef } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewCard } from '@/components';
import { Furnizor, Recenzie } from '@/types';
import { getRatingColor } from '@/lib/utils/rating';
import Link from 'next/link';

interface ClaimFormData {
  numeReprezentant: string;
  functie: string;
  telefon: string;
  cui: string;
  adresa: string;
  message: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilPage({ params }: PageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [furnizor, setFurnizor] = useState<Furnizor | null>(null);
  const [recenzii, setRecenzii] = useState<Recenzie[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [claimForm, setClaimForm] = useState<ClaimFormData>({
    numeReprezentant: '',
    functie: '',
    telefon: '',
    cui: '',
    adresa: '',
    message: '',
  });
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!db || !id) return;

      try {
        const furnizorDoc = await getDoc(doc(db, 'furnizori', id));
        
        if (!furnizorDoc.exists()) {
          setLoading(false);
          return;
        }

        const furnizorData = furnizorDoc.data();
        setFurnizor({
          id: furnizorDoc.id,
          nume: furnizorData.nume || '',
          telefon: furnizorData.telefon || '',
          email: furnizorData.email,
          companie: furnizorData.companie,
          creat_la: furnizorData.creat_la,
          claimed: furnizorData.claimed || false,
        });

        // Load reviews
        const recenziiSnapshot = await getDocs(collection(furnizorDoc.ref, 'recenzii'));
        const reviews: Recenzie[] = [];
        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalRating = 0;

        recenziiSnapshot.forEach((doc) => {
          const data = doc.data();
          const rating = data.rating || 0;
          reviews.push({
            id: doc.id,
            mesaj: data.mesaj,
            rating,
            data: data.data,
            timestamp: data.timestamp?.toDate?.(),
          });
          
          const roundedRating = Math.round(rating);
          if (roundedRating >= 1 && roundedRating <= 5) {
            distribution[roundedRating]++;
          }
          totalRating += rating;
        });

        // Sort by date descending
        reviews.sort((a, b) => {
          const dateA = a.timestamp ? a.timestamp.getTime() : new Date(a.data || 0).getTime();
          const dateB = b.timestamp ? b.timestamp.getTime() : new Date(b.data || 0).getTime();
          return dateB - dateA;
        });

        setRecenzii(reviews);
        setRatingDistribution(distribution);
        setAverageRating(reviews.length > 0 ? totalRating / reviews.length : 0);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !furnizor) return;

    // Validate required fields
    if (!claimForm.numeReprezentant || !claimForm.telefon || !claimForm.cui) {
      alert('Vă rugăm completați câmpurile obligatorii: Nume reprezentant, Telefon și CUI.');
      return;
    }

    setClaimSubmitting(true);
    try {
      // Upload files to Firebase Storage
      const fileUrls: string[] = [];
      if (storage && uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const fileRef = ref(storage, `claim-documents/${id}/${Date.now()}-${file.name}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          fileUrls.push(url);
        }
      }

      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          furnizorId: id,
          furnizorNume: furnizor.nume || furnizor.companie,
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          ...claimForm,
          documents: fileUrls,
        }),
      });

      if (response.ok) {
        setClaimSuccess(true);
      } else {
        throw new Error('Failed to submit claim');
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('A apărut o eroare. Vă rugăm încercați din nou.');
    } finally {
      setClaimSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      // Limit to 5 files, max 10MB each
      const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024);
      if (validFiles.length !== newFiles.length) {
        alert('Unele fișiere depășesc limita de 10MB și nu au fost adăugate.');
      }
      setUploadedFiles(prev => [...prev, ...validFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-sky-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-6 text-slate-500 dark:text-slate-400 animate-pulse">Se încarcă profilul...</p>
      </div>
    );
  }

  if (!furnizor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 mb-6">
          <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Profil negăsit
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Ne pare rău, dar acest profil nu există sau a fost șters.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-linear-to-r from-sky-500 to-violet-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-sky-500/25 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Înapoi la pagina principală
        </Link>
      </div>
    );
  }

  const totalReviews = recenzii.length;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Header */}
      <div className="relative bg-linear-to-br from-slate-800 via-slate-900 to-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-sky-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 -right-40 w-80 h-80 bg-violet-500 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Înapoi la căutare
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-linear-to-br from-sky-400 to-violet-400 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-2xl shadow-sky-500/25">
              {(furnizor.nume || furnizor.companie || '?')[0].toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {furnizor.nume || furnizor.companie || 'Companie'}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  furnizor.claimed 
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
                    : 'bg-slate-700 text-slate-400 border border-slate-600'
                }`}>
                  {furnizor.claimed ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verificat
                    </>
                  ) : (
                    <>Nerevendicat</>
                  )}
                </span>
              </div>
              
              {/* Rating Display */}
              <div className="flex flex-wrap items-center gap-4">
                <div 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ backgroundColor: `${getRatingColor(averageRating)}20` }}
                >
                  <span 
                    className="text-3xl font-bold"
                    style={{ color: getRatingColor(averageRating) }}
                  >
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className="text-xl"
                        style={{
                          color: star <= Math.round(averageRating) 
                            ? getRatingColor(averageRating) 
                            : 'rgba(255,255,255,0.2)'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-slate-400">
                  {totalReviews} {totalReviews === 1 ? 'recenzie' : 'recenzii'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" className="fill-slate-50 dark:fill-slate-900"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Informații companie
              </h3>
              <div className="space-y-4">
                {furnizor.telefon && (
                  <a 
                    href={`tel:${furnizor.telefon}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Telefon</p>
                      <p className="font-medium text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{furnizor.telefon}</p>
                    </div>
                  </a>
                )}
                {furnizor.email && (
                  <a 
                    href={`mailto:${furnizor.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                      <p className="font-medium text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors break-all">{furnizor.email}</p>
                    </div>
                  </a>
                )}
                
                {/* Claim Button - only show if not claimed */}
                {!furnizor.claimed && (
                  <button
                    onClick={() => setShowClaimModal(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Revendică acest profil
                  </button>
                )}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Distribuție rating
              </h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{rating}</span>
                        <span style={{ color: getRatingColor(rating) }}>★</span>
                      </div>
                      <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: getRatingColor(rating),
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm font-medium text-slate-500 dark:text-slate-400">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Toate recenziile
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {totalReviews} {totalReviews === 1 ? 'recenzie' : 'recenzii'}
              </span>
            </div>
            
            {recenzii.length > 0 ? (
              <div className="space-y-4">
                {recenzii.map((review, index) => (
                  <div 
                    key={review.id}
                    className="animate-in fade-in slide-in-from-right-4"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                  >
                    <ReviewCard review={{ ...review, nume_furnizor: furnizor.nume }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  Nu există recenzii pentru acest furnizor.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 py-12 bg-linear-to-r from-sky-500/10 via-violet-500/10 to-sky-500/10 rounded-3xl">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Ai lucrat cu acest furnizor?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Împărtășește experiența ta pentru a ajuta alți utilizatori să aleagă mai bine.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-linear-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Adaugă o recenzie
          </Link>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !claimSubmitting && setShowClaimModal(false)}
          />
          <div className="relative bg-slate-900 rounded-2xl p-6 md:p-8 w-full max-w-lg border border-slate-700 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {claimSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cerere trimisă!</h3>
                <p className="text-slate-400 mb-6">
                  Vom verifica documentele și te vom contacta în curând pe email.
                </p>
                <button
                  onClick={() => {
                    setShowClaimModal(false);
                    setClaimSuccess(false);
                    setClaimForm({
                      numeReprezentant: '',
                      functie: '',
                      telefon: '',
                      cui: '',
                      adresa: '',
                      message: '',
                    });
                    setUploadedFiles([]);
                  }}
                  className="px-6 py-2.5 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
                >
                  Închide
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Revendică profilul</h3>
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    disabled={claimSubmitting}
                  >
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {!user ? (
                  <div className="text-center py-4">
                    <p className="text-slate-400 mb-4">
                      Trebuie să fii autentificat pentru a revendica acest profil.
                    </p>
                    <button
                      onClick={() => setShowClaimModal(false)}
                      className="px-6 py-2.5 bg-linear-to-r from-sky-500 to-violet-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      Autentifică-te
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleClaimSubmit} className="space-y-4">
                    <p className="text-slate-400 text-sm">
                      Completează formularul pentru a revendica acest profil. Vom verifica informațiile și te vom contacta.
                    </p>
                    
                    {/* Company & Account Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                        <p className="text-xs text-slate-500 mb-1">Companie</p>
                        <p className="text-white font-medium text-sm truncate">{furnizor?.nume || furnizor?.companie}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                        <p className="text-xs text-slate-500 mb-1">Contul tău</p>
                        <p className="text-white font-medium text-sm truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Representative Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Nume reprezentant <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={claimForm.numeReprezentant}
                        onChange={(e) => setClaimForm(prev => ({ ...prev, numeReprezentant: e.target.value }))}
                        placeholder="Ion Popescu"
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>

                    {/* Function & Phone */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                          Funcție
                        </label>
                        <input
                          type="text"
                          value={claimForm.functie}
                          onChange={(e) => setClaimForm(prev => ({ ...prev, functie: e.target.value }))}
                          placeholder="Administrator"
                          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                          Telefon <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          value={claimForm.telefon}
                          onChange={(e) => setClaimForm(prev => ({ ...prev, telefon: e.target.value }))}
                          placeholder="+40712345678"
                          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                          required
                        />
                      </div>
                    </div>

                    {/* CUI */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        CUI / CIF <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={claimForm.cui}
                        onChange={(e) => setClaimForm(prev => ({ ...prev, cui: e.target.value }))}
                        placeholder="RO12345678"
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Adresa sediului
                      </label>
                      <input
                        type="text"
                        value={claimForm.adresa}
                        onChange={(e) => setClaimForm(prev => ({ ...prev, adresa: e.target.value }))}
                        placeholder="Str. Exemplu nr. 1, București"
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Documente justificative
                      </label>
                      <p className="text-xs text-slate-500 mb-2">
                        Încarcă certificat CUI, certificat constatator sau alt document oficial (max 5 fișiere, 10MB/fișier)
                      </p>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        multiple
                      />
                      
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-4 border-2 border-dashed border-slate-700 rounded-xl hover:border-sky-500 transition-colors group"
                        disabled={uploadedFiles.length >= 5}
                      >
                        <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-sky-400">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm font-medium">Click pentru a încărca fișiere</span>
                        </div>
                      </button>

                      {/* Uploaded Files List */}
                      {uploadedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                              <div className="flex items-center gap-2 min-w-0">
                                <svg className="w-5 h-5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm text-white truncate">{file.name}</span>
                                <span className="text-xs text-slate-500 shrink-0">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="p-1 hover:bg-slate-700 rounded transition-colors"
                              >
                                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Mesaj adițional
                      </label>
                      <textarea
                        value={claimForm.message}
                        onChange={(e) => setClaimForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Informații suplimentare despre companie..."
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                        rows={2}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={claimSubmitting}
                      className="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {claimSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Se trimite...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Trimite cererea
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
