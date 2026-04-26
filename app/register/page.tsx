'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Vérification du code Bêta (VIP_GRADORA par exemple)
    if (inviteCode !== 'VIP_GRADORA') {
      setError("Le code d'invitation est invalide.");
      setLoading(false);
      return;
    }

    // 2. Inscription Auth Supabase
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 3. Création du profil avec les 50 points offerts
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id, 
            full_name: '', // À compléter par l'utilisateur plus tard
            style_points_total: 50,
            is_beta_tester: true 
          }
        ]);

      if (profileError) {
        console.error(profileError);
      }
    }

    router.push('/catalogue?welcome=true');
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-2xl font-light tracking-[0.3em] uppercase hover:text-amber-400 transition-colors">
            Gradora
          </Link>
          <h1 className="mt-8 font-display text-xl font-light uppercase tracking-widest text-amber-400">
            Accès Bêta Privé
          </h1>
          <p className="mt-2 text-neutral-500 font-sans text-[11px] tracking-wider uppercase">
            Devenez l'une de nos premières ambassadrices
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm focus:border-amber-400 outline-none transition-colors"
                placeholder="votre@email.com"
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm focus:border-amber-400 outline-none transition-colors"
              />
            </div>

            <div className="pt-4 border-t border-neutral-900">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-amber-400/80 mb-2">Code d'invitation</label>
              <input
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-amber-400/5 border border-amber-400/20 px-4 py-3 text-sm focus:border-amber-400 outline-none transition-colors text-amber-400 uppercase tracking-widest"
                placeholder="ENTREZ VOTRE CODE"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] uppercase tracking-wider text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-sans text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Création en cours...' : 'Rejoindre Gradora'}
          </button>
        </form>

        <p className="mt-8 text-center text-neutral-600 text-[10px] tracking-widest uppercase">
          Déjà membre ? <Link href="/login" className="text-neutral-400 underline underline-offset-4">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}