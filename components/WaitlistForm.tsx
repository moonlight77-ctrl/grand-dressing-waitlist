'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Pour lire l'URL
import { Share2, Check, Copy, Loader2 } from 'lucide-react';
import { joinWaitlist } from '@/app/actions'; // On importe notre action serveur

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
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

    // Appel à la Server Action
    const result = await joinWaitlist(formData, referredBy);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success && result.code) {
      setReferralCode(result.code);
      setSubmitted(true);
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ... La fonction shareOnSocial reste identique ...
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

  if (submitted) {
    // ... (Le code de l'écran de succès reste le même que précédemment) ...
    // Juste s'assurer d'afficher le referralCode qu'on a reçu du serveur
    return (
        <div className="max-w-lg mx-auto bg-neutral-900/50 backdrop-blur-md border border-amber-200/10 p-8 md:p-12 animate-in fade-in zoom-in duration-500">
             {/* ... Reste du design de succès ... */}
             <div className="bg-neutral-950/60 border border-amber-200/10 p-6 md:p-8 mb-6">
                <h3 className="font-sans text-sm uppercase letter-spacing-luxury mb-4 flex items-center gap-2 text-neutral-400">
                    <Share2 className="w-4 h-4" strokeWidth={1.5} />
                    Votre lien d'invitation
                </h3>
                <div className="flex gap-3 mb-6">
                    <input
                    type="text"
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${referralCode}`}
                    readOnly
                    className="font-sans flex-1 px-4 py-4 bg-neutral-900/80 border border-amber-200/20 text-center text-xs sm:text-sm font-medium tracking-widest text-amber-200 min-w-0"
                    />
                    <button onClick={copyReferralLink} className="px-6 py-4 bg-amber-600 hover:bg-amber-500 transition-colors cursor-pointer flex-shrink-0">
                    {copied ? <Check className="w-5 h-5 text-neutral-950" /> : <Copy className="w-5 h-5 text-neutral-950" />}
                    </button>
                </div>
                {/* ... Boutons sociaux ... */}
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
             <p className="font-sans text-xs text-neutral-500 uppercase letter-spacing-luxury">
                Vérifiez vos emails pour confirmer votre place.
            </p>
        </div>
    )
  }

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
          className="font-sans flex-1 px-8 py-5 rounded-none bg-neutral-900/40 backdrop-blur-sm border border-amber-200/20 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-200/60 transition-colors letter-spacing-luxury disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="font-sans px-10 py-5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-neutral-950 font-medium hover:from-amber-500 hover:via-amber-400 hover:to-yellow-500 transition-all letter-spacing-luxury cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
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