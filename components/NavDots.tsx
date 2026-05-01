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
    <div className="flex gap-4 justify-center py-5">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`w-6 h-6 rounded-full transition-all duration-300 ${
            i === current
              ? "bg-amber-400 scale-125"
              : "bg-white/25 hover:bg-white/50"
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}
