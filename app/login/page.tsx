'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true); // Commencer à true pour le check initial
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // REDIRECTION SI DÉJÀ CONNECTÉ
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/catalogue');
      } else {
        setLoading(false); // On n'affiche le formulaire que si pas de session
      }
    };
    checkUser();
  }, [router, supabase]);

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
    router.refresh();
  };

  if (loading && email === '') {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-200 uppercase tracking-widest text-xs">Vérification...</div>;
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 relative flex items-center justify-center px-6 overflow-hidden">
      
      {/* DECORATION : Arrière-plan avec image mode tamisée */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/80 to-neutral-950 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070" 
          alt="Luxury Fashion Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* BOUTON RETOUR ACCUEIL */}
      <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-[10px] uppercase tracking-widest group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Accueil
      </Link>

      <div className="w-full max-w-md relative z-20">
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-3xl font-light tracking-[0.4em] uppercase hover:text-amber-400 transition-colors">
            Gradora
          </Link>
          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="w-8 h-px bg-amber-400/30"></span>
            <h1 className="font-display text-xl font-light uppercase tracking-[0.2em] text-white">
              Connexion
            </h1>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2 font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 px-4 py-4 text-sm focus:border-amber-400 outline-none transition-all placeholder:text-neutral-700"
                placeholder="votre@email.com"
              />
            </div>
            
            <div className="relative">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2 font-medium">Mot de passe</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 px-4 py-4 text-sm focus:border-amber-400 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-neutral-600 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 py-3 px-4">
               <p className="text-red-400 text-[10px] uppercase tracking-wider text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-white text-black font-sans text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-amber-400 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Authentification...' : 'Accéder au catalogue'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-neutral-900/50 text-center">
          <p className="text-neutral-600 text-[10px] tracking-widest uppercase">
            Accès réservé aux membres. <br />
            <Link href="/register" className="text-neutral-400 hover:text-amber-200 transition-colors underline underline-offset-8 mt-4 inline-block">
              S'inscrire à la Bêta
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}