'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Pour lire l'URL
import { Share2, Check, Copy, Loader2 } from 'lucide-react';
import { joinWaitlist } from '@/app/actions'; // On importe notre action serveur

// Étend la fenêtre pour TypeScript (le script Tally attache Tally à window)
declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

// ID de votre formulaire Tally (extrait de https://tally.so/r/GxRz5O)
const TALLY_FORM_ID = 'GxRz5O';

type Step = 'form' | 'qualifying' | 'referral';

export default function WaitlistForm() {
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Récupérer le paramètre ?ref=XXX dans l'URL
  const searchParams = useSearchParams();
  const referredBy = searchParams.get('ref');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('email', email);

    // Appel à la Server Action (insertion Supabase + email Resend en filet de sécurité)
    const result = await joinWaitlist(formData, referredBy);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success && result.code) {
      setReferralCode(result.code);
      setLoading(false);
      // On enchaîne DIRECTEMENT sur le questionnaire, sans dépendre de l'email
      setStep('qualifying');
    }
  };

  // Écoute des messages postés par l'iframe Tally pour détecter la soumission
  useEffect(() => {
    if (step !== 'qualifying') return;

    function handleMessage(event: MessageEvent) {
      if (event.origin !== 'https://tally.so') return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.event === 'Tally.FormSubmitted') {
          setStep('referral');
        }
      } catch {
        // Message non-JSON venant de Tally (redimensionnement etc.), on ignore
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [step]);

  // Chargement du script Tally en JS natif (méthode officielle Tally, plus fiable
  // que next/script en timing). Filet de sécurité : si window.Tally n'apparaît pas
  // après le chargement, on force manuellement le src de l'iframe.
  // Note : on n'utilise plus le redimensionnement auto de Tally (peu fiable dans
  // ce contexte) — la hauteur est gérée par le conteneur CSS (75vh mobile / 600px desktop).
  useEffect(() => {
    if (step !== 'qualifying') return;

    const SCRIPT_SRC = 'https://tally.so/widgets/embed.js';

    const activateEmbeds = () => {
      if (typeof window.Tally !== 'undefined') {
        window.Tally.loadEmbeds();
      } else {
        document
          .querySelectorAll<HTMLIFrameElement>('iframe[data-tally-src]:not([src])')
          .forEach((el) => {
            el.src = el.dataset.tallySrc || '';
          });
      }
    };

    if (typeof window.Tally !== 'undefined') {
      activateEmbeds();
    } else if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.onload = activateEmbeds;
      script.onerror = activateEmbeds; // Filet de sécurité si le script échoue à charger
      document.body.appendChild(script);
    } else {
      activateEmbeds();
    }

    // Filet de sécurité supplémentaire : si après 2s l'iframe n'a toujours pas
    // de src (script bloqué par un adblocker), on force l'assignation manuelle.
    const fallbackTimer = setTimeout(activateEmbeds, 2000);
    return () => clearTimeout(fallbackTimer);
  }, [step]);

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    const text = "Accédez à une garde-robe infinie de créateurs";
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  // --- ÉTAPE 2 : QUALIFICATION (Tally embed) ---
  if (step === 'qualifying') {
    // On pré-remplit l'email et on transmet le code de parrainage en paramètre caché
    // (à condition d'avoir créé des champs cachés "email" et "ref" dans les réglages Tally)
    const tallyQuery = `hideTitle=1&transparentBackground=1&email=${encodeURIComponent(
      email
    )}&ref=${encodeURIComponent(referralCode)}`;

    return (
      <div className="max-w-lg mx-auto bg-neutral-950/95 backdrop-blur-xl border border-gold-400/10 p-6 md:p-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-6">
          <p className="font-sans text-xs uppercase letter-spacing-luxury tracking-[0.2em] text-gold-400 mb-2">
            Vous êtes sur la liste ✨
          </p>
          <h3 className="font-display text-xl md:text-2xl font-light mb-2">
            Encore 30 secondes pour débloquer votre tarif fondateur
          </h3>
          <p className="font-sans text-sm text-neutral-400">
            Aidez-nous à préparer une sélection à votre taille pour le 16 septembre.
          </p>
        </div>

        <div className="bg-transparent max-h-[75vh] md:max-h-[600px] overflow-y-auto">
          {/* data-tally-src (et non src) : le script embed.js prend le relais
              et assigne le src réel de l'iframe. La hauteur est fixée par le
              conteneur ci-dessus (75% de l'écran sur mobile, 600px sur desktop),
              avec défilement interne — plus fiable que le redimensionnement auto. */}
          <iframe
            data-tally-src={`https://tally.so/embed/${TALLY_FORM_ID}?${tallyQuery}`}
            loading="lazy"
            width="100%"
            height="100%"
            title="Questionnaire style"
            className="w-full h-full border-0 min-h-[400px]"
          />
        </div>

        <button
          onClick={() => setStep('referral')}
          className="font-sans text-xs text-neutral-400 hover:text-gold-400 uppercase letter-spacing-luxury tracking-widest mt-6 pb-1 mx-auto block transition-colors cursor-pointer"
        >
          Passer cette étape pour l'instant
        </button>
      </div>
    );
  }

  // --- ÉTAPE 3 : PARRAINAGE (succès final) ---
  if (step === 'referral') {
    return (
      <div className="max-w-lg mx-auto bg-neutral-950/95 backdrop-blur-xl border border-gold-400/10 p-8 md:p-12 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-6">
          <Check className="w-8 h-8 text-gold-400 mx-auto mb-3" strokeWidth={1.2} />
          <h3 className="font-display text-xl md:text-2xl font-light">Bienvenue dans le cercle</h3>
        </div>

        <div className="bg-neutral-950/60 border border-gold-400/10 p-6 md:p-8 mb-6">
          <h3 className="font-sans text-sm uppercase letter-spacing-luxury mb-4 flex items-center gap-2 text-neutral-400">
            <Share2 className="w-4 h-4" strokeWidth={1.5} />
            Votre lien d'invitation
          </h3>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${referralCode}`}
              readOnly
              className="font-sans flex-1 px-4 py-4 bg-neutral-900/80 border border-gold-400/20 text-center text-xs sm:text-sm font-medium tracking-widest text-gold-400 min-w-0"
            />
            <button onClick={copyReferralLink} className="px-6 py-4 bg-gold-400 hover:bg-gold-300 transition-colors cursor-pointer flex-shrink-0">
              {copied ? <Check className="w-5 h-5 text-neutral-950" /> : <Copy className="w-5 h-5 text-neutral-950" />}
            </button>
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {['twitter', 'facebook', 'linkedin'].map((platform) => (
              <button
                key={platform}
                onClick={() => shareOnSocial(platform as any)}
                className="font-sans px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-[10px] sm:text-xs uppercase letter-spacing-luxury transition-colors cursor-pointer"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
        <p className="font-sans text-xs text-neutral-500 uppercase letter-spacing-luxury text-center">
          Un email de confirmation vous a aussi été envoyé.
        </p>
      </div>
    );
  }

  // --- ÉTAPE 1 : FORMULAIRE EMAIL ---
  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          disabled={loading}
          className="font-sans flex-1 px-8 py-5 rounded-none bg-neutral-900/40 backdrop-blur-sm border border-gold-400/20 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-gold-400/60 transition-colors letter-spacing-luxury disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="font-sans px-10 py-5 bg-gold-400 text-neutral-950 font-medium hover:bg-gold-300 transition-all letter-spacing-luxury cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'REJOINDRE'}
        </button>
      </form>
      {error && (
        <p className="text-red-400 text-xs mb-4 text-center">{error}</p>
      )}
      <p className="font-sans text-xs text-neutral-500 uppercase letter-spacing-luxury">
        Rejoignez une communauté exclusive · Places limitées
      </p>
    </div>
  );
}