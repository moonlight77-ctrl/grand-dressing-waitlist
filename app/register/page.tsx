'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, X } from 'lucide-react';
import { sendSignupConfirmationEmail } from '@/app/register/actions'

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [acceptedCharte, setAcceptedCharte] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedCharte) {
      setError("Vous devez accepter la Charte Gradora pour continuer.");
      return;
    }

    setLoading(true);
    setError(null);

    if (inviteCode !== 'VIP_GRADORA') {
      setError("Le code d'invitation est invalide.");
      setLoading(false);
      return;
    }

    // 1. Inscription Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
      emailRedirectTo: `${location.origin}/catalogue`,
      data: {
      charte_accepted: true,
      charte_accepted_at: new Date().toISOString(),
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

if (data?.user) { 
      const confirmUrl = `${location.origin}/auth/callback`;
      // On retire le "await" pour envoyer le mail en tâche de fond 
      // sans faire ramer l'écran de l'utilisatrice
      sendSignupConfirmationEmail(email, confirmUrl);
    }

    router.push('/catalogue?welcome=true');
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl uppercase tracking-[0.3em]">Gradora</h1>
          <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-2 italic">Inscription Ambassadrice</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Email</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm focus:border-amber-400 outline-none transition-colors"
              />
            </div>
            
            {/* MOT DE PASSE AVEC ŒIL ALIGNÉ */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Mot de passe</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 pr-12 text-sm focus:border-amber-400 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-neutral-500 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-900">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-amber-400/80 mb-2">Code d'invitation</label>
              <input
                type="text" required value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-amber-400/5 border border-amber-400/20 px-4 py-3 text-sm focus:border-amber-400 outline-none transition-colors text-amber-400 uppercase tracking-widest"
                placeholder="VIP_XXXX"
              />
            </div>
          </div>

          {/* CHECKBOX CHARTE */}
          <div className="flex items-start gap-3 py-2">
            <input
              id="charte" type="checkbox" checked={acceptedCharte}
              onChange={(e) => setAcceptedCharte(e.target.checked)}
              className="mt-1 h-4 w-4 accent-amber-400 bg-neutral-900 border-neutral-800"
            />
            <label htmlFor="charte" className="text-[10px] text-neutral-400 uppercase tracking-wider leading-relaxed">
              J'accepte la <button type="button" onClick={() => setShowModal(true)} className="text-amber-400 underline underline-offset-4">Charte de la testeuse</button>.
            </label>
          </div>

          {error && <p className="text-red-500 text-[10px] uppercase tracking-wider text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !acceptedCharte}
            className={`w-full py-4 font-sans text-[11px] tracking-[0.25em] uppercase font-bold transition-colors ${acceptedCharte ? 'bg-white text-black hover:bg-amber-400' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
          >
            {loading ? 'Création...' : 'Rejoindre l\'aventure'}
          </button>
        </form>
      </div>

      {/* POP-UP MODALE DE LA CHARTE */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 md:p-12 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-neutral-500 hover:text-white"><X /></button>
            <h2 className="font-display text-2xl uppercase tracking-widest text-amber-400 mb-8">Charte Gradora</h2>
            <div className="space-y-6 text-neutral-300 text-xs md:text-sm leading-relaxed font-sans">
              <p className="italic text-neutral-400">Bienvenue dans la famille ! Ce document assure que l'aventure se passe au mieux.</p>
              <section>
                <h3 className="text-white font-bold mb-2">1. Mission Contenu 🤳</h3>
                <p>2 à 3 contenus (TikTok/Reels) par mois. Tague @Gradora.</p>
              </section>
              <section>
                <h3 className="text-white font-bold mb-2">2. Logistique 📦</h3>
                <p>Prêt d'un mois. Remise en main propre possible (Paris). Conserver le packaging.</p>
              </section>
              <section>
                <h3 className="text-white font-bold mb-2">3. Soin & Responsabilité ✨</h3>
                <p>Ne pas laver soi-même (pressing inclus). Remboursement (80-100%) exigé en cas de dégradation majeure.</p>
              </section>
              <p className="pt-6 border-t border-neutral-800 text-[10px] text-neutral-500 uppercase">En cochant la case, tu confirmes avoir lu et accepté ces points.</p>
              <button 
                onClick={() => { setAcceptedCharte(true); setShowModal(false); }}
                className="w-full py-4 bg-amber-400 text-black font-bold uppercase text-[10px] tracking-widest mt-4"
              >
                J'ai lu et j'accepte
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}