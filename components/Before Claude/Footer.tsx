import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-amber-200/10 bg-neutral-950 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Icône Décorative */}
        <div className="mb-8">
          <Sparkles className="w-6 h-6 text-amber-200/40" strokeWidth={1} />
        </div>

        {/* Liens de Navigation & Réseaux */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8 text-xs uppercase letter-spacing-luxury tracking-[0.15em] text-neutral-400">
          
          <Link 
            href="/mentions" 
            className="hover:text-amber-200 transition-colors duration-300"
          >
            Mentions Légales
          </Link>

          <a 
            href="mailto:gdcreativebrand@gmail.com" 
            className="hover:text-amber-200 transition-colors duration-300"
          >
            Contact
          </a>

          <a 
            href="https://www.instagram.com/gdcreativebrand?igsh=MWZkamQ2anNuYnIzaA==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-amber-200 transition-colors duration-300"
          >
            Instagram
          </a>

          <a 
            href="https://www.tiktok.com/@gdcreativebrand?_r=1&_t=ZN-939rSfzYDeI" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-amber-200 transition-colors duration-300"
          >
            TikTok
          </a>

        </nav>

        {/* Copyright */}
        <p className="text-neutral-600 text-[10px] uppercase letter-spacing-luxury tracking-widest">
          © {new Date().getFullYear()} GrandDressing · Tous droits réservés
        </p>
      </div>
    </footer>
  );
}