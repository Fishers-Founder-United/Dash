"use client";

interface NavDotsProps {
  total: number;
  current: number;
  onSelect: (i: number) => void;
  hidden?: boolean;
}

export default function NavDots({
  total,
  current,
  onSelect,
  hidden,
}: NavDotsProps) {
  if (hidden) return null;
  return (
    <div className="flex items-center gap-2.5 justify-center py-5">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`h-4 rounded-[2px] transition-all duration-300 ${
            i === current
              ? "w-9 bg-[var(--accent)]"
              : "w-4 bg-transparent border-2 border-[var(--line)] hover:border-[var(--faint)]"
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}
