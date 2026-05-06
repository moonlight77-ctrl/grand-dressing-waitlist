'use client';

import { useCart } from '@/store/useCart';

export default function CapacityDropdown() {
  const { getTotalPoints, maxPoints } = useCart();
  const used = getTotalPoints();
  const total = maxPoints;
  const dots = Math.round((used / total) * 5); // 0–5 segments

  return (
    <div className="hidden md:flex items-center gap-3 text-neutral-400">
      {/* Dots capacité */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i < dots ? 'bg-amber-400' : 'bg-neutral-700'
            }`}
          />
        ))}
      </div>

      {/* Texte */}
      <span className="text-[9px] uppercase tracking-[0.2em] font-sans whitespace-nowrap">
        Capacité :{' '}
        <span className="text-white font-bold">{used}</span>
        {' / '}{total} pts
      </span>
    </div>
  );
}