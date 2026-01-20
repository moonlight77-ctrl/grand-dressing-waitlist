import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-amber-200/30">
      
      {/* En-tête simple pour le retour */}
      <nav className="p-6 md:p-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-200 transition-colors uppercase text-xs tracking-widest letter-spacing-luxury"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pb-24">
        {/* Titre de la page */}
        <h1 className="font-display text-4xl md:text-5xl font-light mb-12 text-center text-amber-50">
          Mentions Légales
        </h1>

        <div className="space-y-12 text-neutral-300 font-light leading-relaxed">
          
          {/* Section 1 : Éditeur */}
          <section>
            <h2 className="font-display text-2xl text-amber-200 mb-4">1. Éditeur du site</h2>
            <p className="mb-2">
              Le site <strong>GrandDressing</strong> est édité par :
            </p>
            <ul className="list-none space-y-1 pl-4 border-l border-amber-200/20">
              <li><strong>Nom / Raison sociale :</strong> [GORDINI DUFERMEAU]</li>
              <li><strong>Statut juridique :</strong> [SASU]</li>
              <li><strong>Adresse :</strong> [75020]</li>
              <li><strong>Email :</strong> gdcreativebrand@gmail.com</li>
              {/* Ajoutez le SIRET si vous en avez un */}
              {/* <li><strong>SIRET :</strong> 000 000 000 00000</li> */}
            </ul>
          </section>

          {/* Section 2 : Hébergement */}
          <section>
            <h2 className="font-display text-2xl text-amber-200 mb-4">2. Hébergement</h2>
            <p>
              Ce site est hébergé par :<br />
              <strong>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133<br />
              Covina, CA 91723<br />
              États-Unis
            </p>
          </section>

          {/* Section 3 : Propriété intellectuelle */}
          <section>
            <h2 className="font-display text-2xl text-amber-200 mb-4">3. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
            </p>
          </section>

          {/* Section 4 : Données personnelles */}
          <section>
            <h2 className="font-display text-2xl text-amber-200 mb-4">4. Données personnelles</h2>
            <p className="mb-4">
              Les informations recueillies via le formulaire d'inscription (email) sont enregistrées dans un fichier informatisé par <strong>GrandDressing</strong> pour la gestion de la liste d'attente et l'envoi d'informations relatives au lancement du service.
            </p>
            <p>
              Elles sont conservées pendant une durée de 3 ans et sont destinées exclusivement à l'équipe de GrandDressing. 
              Conformément à la loi « informatique et libertés », vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier en contactant : gdcreativebrand@gmail.com.
            </p>
          </section>

        </div>
      </main>

      {/* Footer minimaliste pour la page mentions */}
      <footer className="py-8 text-center border-t border-amber-200/10 text-neutral-600 text-[10px] uppercase tracking-widest">
        © {new Date().getFullYear()} GrandDressing
      </footer>
    </div>
  );
}