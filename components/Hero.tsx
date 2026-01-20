import React, { Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import WaitlistForm from './WaitlistForm';

export default function Hero() {
  return (
    <div className="relative h-screen min-h-[800px]">
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
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-neutral-950"></div>
      </div>

      {/* Contenu Hero */}
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center w-full">
          <div className="mb-6 flex justify-center">
            <Sparkles className="w-8 h-8 text-amber-200" strokeWidth={1} />
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-light mb-8 text-shadow-gold letter-spacing-luxury leading-tight">
            Votre garde-robe infinie
            <span className="block mt-2 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent font-normal">
              commence ici
            </span>
          </h1>
          
          <p className="font-sans text-lg md:text-xl mb-16 text-neutral-300 max-w-2xl mx-auto font-light letter-spacing-luxury">
            Des centaines de créateurs. Un seul abonnement. Renouvelez votre style aussi souvent que vous le souhaitez.
          </p>

          {/* CORRECTION ICI : Le formulaire est DANS la Suspense */}
          <Suspense fallback={<div className="h-20 text-amber-200/50">Chargement...</div>}>
            <WaitlistForm />
          </Suspense>
          
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border border-amber-200/30 flex justify-center">
          <div className="w-px h-3 bg-amber-200/50 mt-2"></div>
        </div>
      </div>
    </div>
  );
}