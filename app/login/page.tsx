'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // On utilise ton nouvel utilitaire
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Identifiants invalides ou compte inexistant.");
      setLoading(false);
      return;
    }

    router.push('/catalogue');
    router.refresh(); // Pour mettre à jour l'état de la session
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-2xl font-light tracking-[0.3em] uppercase hover:text-amber-400 transition-colors">
            Gradora
          </Link>
          <h1 className="mt-8 font-display text-xl font-light uppercase tracking-widest text-white">
            Connexion
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
          </div>

          {error && <p className="text-red-500 text-[10px] uppercase tracking-wider text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-sans text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-8 text-center text-neutral-600 text-[10px] tracking-widest uppercase">
          Pas encore de code ? <Link href="/register" className="text-neutral-400 underline underline-offset-4">S'inscrire</Link>
        </p>
      </div>
    </main>
  );
}