"use client";

/**
 * Shared console-style section header: a monospace eyebrow (the "channel id"),
 * a large display title, and optional right-aligned readout metadata, over a
 * technical rule. Keeps every slide's header on the same visual grammar.
 */
export default function SlideHeader({
  channel,
  title,
  meta,
}: {
  /** Monospace eyebrow id, e.g. "UPCOMING · EVENTS" */
  channel: string;
  title: string;
  /** Optional right-aligned readout, e.g. "NEXT 12 · INDIANAIOT.COM" */
  meta?: string;
}) {
  return (
    <div className="shrink-0">
      <div className="flex items-end justify-between gap-8">
        <div className="min-w-0">
          <p
            className="eyebrow flex items-center gap-3"
            style={{ fontSize: "clamp(1.3rem, 1.6vw, 2rem)" }}
          >
            <span className="text-[var(--faint)]">//</span>
            {channel}
          </p>
          <h2
            className="font-black leading-none tracking-tight text-[var(--ink)] mt-3"
            style={{ fontSize: "clamp(3rem, 4vw, 5rem)" }}
          >
            {title}
          </h2>
        </div>
        {meta && (
          <p
            className="readout whitespace-nowrap text-right"
            style={{ fontSize: "clamp(1.4rem, 1.7vw, 2.1rem)" }}
          >
            {meta}
          </p>
        )}
      </div>
      <div className="rule mt-5" />
    </div>
  );
}
