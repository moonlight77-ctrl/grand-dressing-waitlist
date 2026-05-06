'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CartStatus from './catalogue/CartStatus';
import LogoutButton from './LogoutButton';
import MiniCart from './navbar/MiniCart';
import CapacityDropdown from './navbar/CapacityDropdown';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    // Écouter les changements d'auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (pathname === '/') return null;

  return (
    <nav className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900">
      <div className="max-w-screen-xl mx-auto px-8 h-20 flex items-center justify-between">
        <Link href="/catalogue" className="font-display text-2xl font-light tracking-[0.3em] uppercase hover:text-amber-400">
          Gradora
        </Link>

        <div className="flex items-center gap-10">
          {user && (
            <>
              <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                <Link href="/catalogue">Catalogue</Link>
                <Link href="/mon-dressing">Mon Dressing</Link>
                <Link href="/concept" className="hover:text-amber-400 transition-colors text-amber-200/50">Comment ça marche</Link>
              </div>

              <div className="flex items-center gap-6 border-l border-neutral-800 pl-6">
                <CapacityDropdown />
                <MiniCart />
                <Link href="/panier"><CartStatus /></Link>
                <LogoutButton />
              </div>
            </>
          )}
          
          {!user && pathname !== '/login' && pathname !== '/register' && (
            <Link href="/login" className="text-[10px] uppercase tracking-widest bg-white text-black px-6 py-2 font-bold hover:bg-amber-400">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}