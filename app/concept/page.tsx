import Link from 'next/link';
import Footer from '@/components/Footer';

const STEPS = [
  {
    number: "01",
    title: "L'Abonnement Bêta",
    description: "En tant qu'ambassadrice, votre accès est privilégié. Utilisez votre code unique pour activer votre dressing de 50 Style Points sans aucun frais.",
    details: ["Accès VIP illimité", "50 Points de capacité", "Sans engagement"]
  },
  {
    number: "02",
    title: "Sélectionnez vos pièces",
    description: "Explorez le catalogue et composez votre box. Chaque vêtement a une valeur (10, 20 ou 30 points) selon sa rareté et sa catégorie.",
    details: ["Mix & Match libre", "Validation instantanée", "Gestion du capital points"]
  },
  {
    number: "03",
    title: "Portez & Rayonnez",
    description: "Recevez vos pièces chez vous. Portez-les pour vos événements, vos contenus ou votre quotidien. Elles sont à vous aussi longtemps que vous le souhaitez.",
    details: ["Pressing inclus", "Assurance micro-accrocs", "Livraison Premium"]
  },
  {
    number: "04",
    title: "Renouvelez à l'infini",
    description: "Envie de nouveauté ? Renvoyez une ou plusieurs pièces. Dès réception, vos points sont libérés pour choisir vos prochains coups de cœur.",
    details: ["Retours gratuits", "Rotation illimitée", "Zéro encombrement"]
  }
];

export default function ConceptPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 font-display">
      {/* Header Minimaliste */}
      <nav className="p-8 flex justify-between items-center border-b border-neutral-900">
        <Link href="/" className="text-xl font-light tracking-[0.3em] uppercase">Gradora</Link>
        <Link href="/register" className="text-[10px] tracking-widest uppercase border border-neutral-800 px-6 py-2 hover:border-amber-400 transition-colors">
          Rejoindre la bêta
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-screen-md mx-auto px-8 py-24 text-center">
        <h1 className="text-3xl md:text-5xl font-light uppercase tracking-[0.2em] leading-tight">
          La mode comme un <span className="text-amber-400 italic font-serif">service</span>
        </h1>
        <p className="mt-8 text-neutral-500 text-sm md:text-base leading-relaxed tracking-wide font-sans max-w-2xl mx-auto">
          Inspiré par la flexibilité du streaming, Gradora remplace la propriété par l’usage. 
          Accédez à une garde-robe illimitée, évolutive et responsable, sans encombrer vos placards.
        </p>
      </section>

      {/* Steps Section */}
      <section className="max-w-screen-xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {STEPS.map((step) => (
            <div key={step.number} className="relative group">
              <span className="text-6xl md:text-8xl font-light text-neutral-900 absolute -top-12 -left-4 z-0 group-hover:text-amber-400/10 transition-colors">
                {step.number}
              </span>
              <div className="relative z-10 pt-4">
                <h2 className="text-xl font-light uppercase tracking-widest mb-6 flex items-center gap-4">
                  <span className="w-8 h-px bg-amber-400" /> {step.title}
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed font-sans mb-8">
                  {step.description}
                </p>
                <ul className="space-y-3">
                  {step.details.map((detail) => (
                    <li key={detail} className="text-[10px] uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-neutral-800" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-neutral-900/30 py-24 border-y border-neutral-900">
        <div className="max-w-screen-md mx-auto px-8 text-center">
          <h3 className="text-2xl font-light uppercase tracking-widest mb-10">Prête à essayer ?</h3>
          <Link 
            href="/register" 
            className="inline-block bg-white text-black px-12 py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-amber-400 transition-colors"
          >
            Activer mon accès VIP
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}