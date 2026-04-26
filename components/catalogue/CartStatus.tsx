// components/catalogue/CartStatus.tsx
'use client';
import { useCart } from '@/store/useCart';

export default function CartStatus() {
  const { getTotalPoints, items, maxPoints } = useCart();
  const total = getTotalPoints();

  return (
    <div className="flex flex-col items-end">
      <div className="flex gap-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-1 ${total >= (i + 1) * 10 ? 'bg-amber-400' : 'bg-neutral-800'}`} 
          />
        ))}
      </div>
      <p className="text-[9px] tracking-widest uppercase text-neutral-400">
        Capacité : <span className={total > 40 ? 'text-amber-400' : 'text-white'}>{total}</span> / {maxPoints} PTS
      </p>
    </div>
  );
}