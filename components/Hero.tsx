// components/Hero.tsx
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Sparkles, KeyRound } from 'lucide-react'; // Import de l'icône clé
import WaitlistForm from './WaitlistForm';

export default function Hero() {
  return (
    <div className="relative h-screen min-h-[800px]">
      
      {/* --- BOUTON CLÉ (ACCÈS LOGIN) --- */}
      <Link 
        href="/login" 
        className="fixed top-8 right-8 z-50 p-3 bg-neutral-900/50 backdrop-blur-md border border-amber-200/10 rounded-full group hover:border-amber-400/50 transition-all duration-500"
        aria-label="Connexion membre"
      >
        <KeyRound 
          className="w-5 h-5 text-amber-200/40 group-hover:text-amber-400 transition-colors" 
          strokeWidth={1.2}
        />
      </Link>

      {/* Vidéo Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/videos/test.mp4" type="video/mp4" />
        </video>
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-neutral-950"></div>
      </div>

      {/* Contenu Hero */}
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center w-full">
          
          {/* Icône décorative supérieure */}
          <div className="mb-6 flex justify-center">
            <Sparkles className="w-8 h-8 text-amber-200" strokeWidth={1} />
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-light mb-8 text-shadow-gold letter-spacing-luxury leading-tight">
            Votre garde-robe infinie
            <span className="block mt-2 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent font-normal">
              commence ici
            </span>
          </h1>
          
          <p className="font-sans text-lg md:text-xl mb-16 text-neutral-300 max-w-2xl mx-auto font-light letter-spacing-luxury leading-relaxed">
            Des centaines de créateurs. Un seul abonnement. Renouvelez votre style aussi souvent que vous le souhaitez.
          </p>

          {/* Formulaire d'inscription Waitlist */}
          <Suspense fallback={<div className="h-20 flex items-center justify-center text-amber-200/50 font-sans text-sm tracking-widest">CHARGEMENT...</div>}>
            <WaitlistForm />
          </Suspense>
          
        </div>
      </div>

      {/* Scroll Indicator (Petit rappel visuel en bas) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-amber-200 to-transparent"></div>
      </div>
    </div>
  );
}