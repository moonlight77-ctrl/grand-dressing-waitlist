import React from 'react';
import { Mail, Share2, Check } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Mail className="w-7 h-7 text-amber-200" strokeWidth={1} />,
      title: "Sélection curée",
      desc: "Des pièces de créateurs établis et émergents, renouvelées chaque saison par nos experts mode"
    },
    {
      icon: <Share2 className="w-7 h-7 text-amber-200" strokeWidth={1} />,
      title: "Mode circulaire",
      desc: "Un modèle pensé pour durer. Portez, retournez, recommencez. Moins de gaspillage, plus de style"
    },
    {
      icon: <Check className="w-7 h-7 text-amber-200" strokeWidth={1} />,
      title: "Livraison fluide",
      desc: "Commandez aujourd'hui, portez demain. Retours gratuits et illimités inclus dans votre abonnement"
    }
  ];

  return (
    <div className="py-32 px-4 bg-gradient-to-b from-neutral-950 to-neutral-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="w-12 h-px bg-amber-200/30"></div>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light letter-spacing-luxury mb-4">
            Comment ça fonctionne
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-8 border border-amber-200/30 flex items-center justify-center group-hover:border-amber-200/60 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-display text-2xl font-normal mb-4 letter-spacing-luxury">
                {feature.title}
              </h3>
              <p className="font-sans text-neutral-400 font-light leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}