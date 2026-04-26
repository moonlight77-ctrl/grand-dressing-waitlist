'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
    // Redirige vers la home et rafraîchit pour nettoyer l'état auth
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-amber-400 transition-colors border border-neutral-800 px-4 py-2 hover:border-amber-400"
    >
      Déconnexion
    </button>
  );
}