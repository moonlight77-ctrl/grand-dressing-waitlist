// components/catalogue/CapacityBadge.tsx

interface CapacityBadgeProps {
  cost: 10 | 20 | 30;
  size?: 'sm' | 'md';
}

const LABELS: Record<number, string> = {
  10: 'Essentiel',
  20: 'Premium',
  30: 'Luxe',
};

export default function CapacityBadge({ cost, size = 'md' }: CapacityBadgeProps) {
  const dots = cost / 10; // 1, 2 or 3
  const isSm = size === 'sm';

  return (
    <div className={`flex items-center gap-${isSm ? '1.5' : '2'}`}>
      {/* Dots */}
      <div className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`
              rounded-full transition-all
              ${isSm ? 'w-1.5 h-1.5' : 'w-2 h-2'}
              ${i <= dots
                ? 'bg-amber-400'
                : 'bg-neutral-700'
              }
            `}
          />
        ))}
      </div>
      {/* Label */}
      <span
        className={`
          font-sans tracking-widest uppercase
          ${isSm ? 'text-[9px]' : 'text-[10px]'}
          ${cost === 30 ? 'text-amber-400' : cost === 20 ? 'text-neutral-300' : 'text-neutral-500'}
        `}
      >
        {LABELS[cost]}
      </span>
    </div>
  );
}
