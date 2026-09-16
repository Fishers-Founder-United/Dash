"use client";

import { QRCodeSVG } from "qrcode.react";

/**
 * Splash slide for the Central Indiana Mesh Network Fall Open House, hosted at
 * the Lab. Built natively from the event flyer rather than shown as a poster
 * image so it scales cleanly on the 4K wall and stays on the console grammar.
 *
 * Runs first in rotation while active, then drops out of the deck on its own
 * after SHOW_UNTIL (inclusive). Remove the slide from SlideShow once it's past.
 */

const EVENT_DATE = "2026-09-26"; // YYYY-MM-DD, local
export const SHOW_UNTIL = "2026-09-27"; // last day the splash is shown

const RSVP_URL = "https://www.cimesh.net";

const STATIONS = [
  { name: "Nacho bar", blurb: "Start here. Refills encouraged.", amber: true },
  { name: "101 corner", blurb: "Hands-on demo nodes and patient people." },
  { name: "Radio corner", blurb: "Antennas, mounts, solar, enclosures." },
  { name: "Live wall", blurb: "The OKI map and live traffic on a big screen." },
  { name: "Flash bench", blurb: "Bring any LoRa board, leave with a node. Loaners on hand." },
  { name: "Sensor & IoT table", blurb: "Telemetry, Home Assistant, BME688 proposal." },
];

const TALK_IN = [
  { band: "GMRS", freq: "462.675", note: "Ch 20 · no tone" },
  { band: "2m ham", freq: "146.520", note: "National simplex" },
  { band: "Mesh", freq: "910.525", note: "#OpenHouse" },
];

/** Local calendar date as YYYY-MM-DD (avoids the UTC rollover of toISOString). */
function localToday(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function isMeshOpenHouseActive(): boolean {
  return localToday() <= SHOW_UNTIL;
}

/** Days from today to the event, in local time. Negative once it has passed. */
function daysUntilEvent(): number {
  const [y, m, d] = EVENT_DATE.split("-").map(Number);
  const event = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((event.getTime() - today.getTime()) / 86_400_000);
}

function countdownLabel(): string {
  const days = daysUntilEvent();
  if (days < 0) return "THAT WAS YESTERDAY · FIND US ANYWAY";
  if (days === 0) return "TODAY · DOORS 4 PM";
  if (days === 1) return "TOMORROW · 4 TO 8 PM";
  return `IN ${days} DAYS · SAT SEP 26`;
}

/** CIMN's radio-wave mark, redrawn as an inline SVG so it stays crisp at 4K. */
function MeshMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="var(--amber)" />
      <circle cx="32" cy="32" r="5" fill="#fff" />
      <path
        d="M22 22a14 14 0 0 0 0 20M42 22a14 14 0 0 1 0 20M14 15a24 24 0 0 0 0 34M50 15a24 24 0 0 1 0 34"
        fill="none"
        stroke="#fff"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MeshOpenHouseSlide() {
  return (
    <div className="flex flex-col h-full px-16 pt-12 pb-10 gap-7">
      {/* Channel eyebrow + countdown readout */}
      <div className="shrink-0 flex items-end justify-between gap-8">
        <div className="flex items-center gap-5 min-w-0">
          <MeshMark className="h-[clamp(3.5rem,4vw,5rem)] w-auto shrink-0" />
          <div className="min-w-0">
            <p
              className="eyebrow eyebrow-amber flex items-center gap-3"
              style={{ fontSize: "clamp(1.3rem, 1.6vw, 2rem)" }}
            >
              <span className="text-[var(--faint)]">//</span>
              CIMN · Fall Open House
            </p>
            <p
              className="mono text-[var(--muted)] tracking-[0.04em] mt-2 truncate"
              style={{ fontSize: "clamp(1.4rem, 1.6vw, 2rem)" }}
            >
              Central Indiana Mesh Network · community-built, off-grid messaging · part of OKI Mesh
            </p>
          </div>
        </div>
        <p
          className="readout whitespace-nowrap text-right text-[var(--amber)] shrink-0"
          style={{ fontSize: "clamp(1.4rem, 1.7vw, 2.1rem)" }}
        >
          {countdownLabel()}
        </p>
      </div>

      {/* Date strip: the single most important line on the wall */}
      <div
        className="shrink-0 flex flex-wrap items-center gap-x-8 gap-y-1 px-8 py-4 rounded-[10px] bg-[var(--ink)] text-white mono font-bold tracking-[0.04em]"
        style={{ fontSize: "clamp(1.7rem, 2.1vw, 2.7rem)" }}
      >
        <span>Saturday, September 26</span>
        <span className="text-[var(--accent-soft)]">·</span>
        <span>4 to 8 PM</span>
        <span className="text-[var(--accent-soft)]">·</span>
        <span>Indiana IoT Lab, Fishers</span>
        <span className="text-[var(--accent-soft)]">·</span>
        <span className="text-amber-300">Free</span>
        <span className="text-[var(--accent-soft)]">·</span>
        <span className="text-amber-300">Free parking</span>
      </div>

      {/* Body: pitch + stations on the left, details + talk-in + QR on the right */}
      <div className="flex-1 min-h-0 flex gap-10">
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <h2
            className="font-black leading-[0.95] tracking-tight text-[var(--ink)]"
            style={{ fontSize: "clamp(3.4rem, 5.2vw, 7rem)" }}
          >
            Mesh Meetup
            <br />
            <span className="text-[var(--amber)]">&amp; Nacho Bar</span>
          </h2>

          <p
            className="text-[var(--muted)] leading-snug max-w-[60ch]"
            style={{ fontSize: "clamp(1.5rem, 1.85vw, 2.4rem)" }}
          >
            Hams, GMRS operators, IoT tinkerers, preppers, makers, and the merely
            curious.{" "}
            <span className="font-bold text-[var(--ink)]">No talks, no agenda.</span>{" "}
            Drop in for twenty minutes or stay all evening. Watch messages hop
            across the state with no towers behind them, and leave with a node in
            your hand.
          </p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-auto">
            {STATIONS.map((s) => (
              <div key={s.name} className="flex items-start gap-4">
                <span className={`dot shrink-0 mt-[0.55em] ${s.amber ? "dot-amber" : ""}`} />
                <p
                  className="text-[var(--muted)] leading-snug"
                  style={{ fontSize: "clamp(1.5rem, 1.7vw, 2.2rem)" }}
                >
                  <span className="font-bold text-[var(--ink)]">{s.name}.</span>{" "}
                  {s.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 w-[clamp(24rem,27vw,36rem)] flex flex-col gap-5">
          {/* The details */}
          <div className="hud hud-amber bg-[var(--amber-tint)] border-2 border-[var(--line)] rounded-[10px] px-7 py-5">
            <p className="eyebrow eyebrow-amber" style={{ fontSize: "clamp(1.3rem, 1.4vw, 1.8rem)" }}>
              The details
            </p>
            <dl
              className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 leading-snug"
              style={{ fontSize: "clamp(1.5rem, 1.65vw, 2.1rem)" }}
            >
              <dt className="font-bold text-[var(--ink)]">When</dt>
              <dd className="text-[var(--muted)]">Sat, Sept 26 · 4 to 8 PM. Come and go.</dd>
              <dt className="font-bold text-[var(--ink)]">Where</dt>
              <dd className="text-[var(--muted)]">9059 Technology Lane, Fishers</dd>
              <dt className="font-bold text-[var(--ink)]">Cost</dt>
              <dd className="text-[var(--muted)]">Free. Nachos included. Bring a friend.</dd>
            </dl>
          </div>

          {/* Talk-in on simplex */}
          <div className="bg-white border-2 border-[var(--line)] rounded-[10px] px-7 py-5">
            <p className="eyebrow" style={{ fontSize: "clamp(1.3rem, 1.4vw, 1.8rem)" }}>
              Talk-in on simplex
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {TALK_IN.map((t) => (
                <div
                  key={t.band}
                  className="grid grid-cols-[5.5em_auto_1fr] items-baseline gap-x-5"
                  style={{ fontSize: "clamp(1.5rem, 1.65vw, 2.1rem)" }}
                >
                  <span className="font-bold text-[var(--ink)]">{t.band}</span>
                  <span className="mono font-bold text-[var(--accent)] tabular-nums tracking-[0.04em]">
                    {t.freq}
                  </span>
                  <span className="text-[var(--muted)] truncate">{t.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP QR */}
          <div className="hud flex-1 min-h-0 flex items-center gap-6 bg-[var(--accent-tint)] border-2 border-[var(--line)] rounded-[10px] px-6 py-5">
            <div className="p-3 bg-white rounded-[8px] shrink-0">
              <QRCodeSVG value={RSVP_URL} size={220} bgColor="#ffffff" fgColor="#000000" level="M" />
            </div>
            <div className="min-w-0">
              <p
                className="font-black text-[var(--ink)] leading-none"
                style={{ fontSize: "clamp(1.9rem, 2.2vw, 2.8rem)" }}
              >
                RSVP &amp; info
              </p>
              <p
                className="text-[var(--muted)] mt-3"
                style={{ fontSize: "clamp(1.4rem, 1.5vw, 1.9rem)" }}
              >
                Scan or visit
              </p>
              <p
                className="mono font-bold text-[var(--accent)] tracking-[0.04em] mt-1"
                style={{ fontSize: "clamp(1.6rem, 1.9vw, 2.4rem)" }}
              >
                cimesh.net
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer line */}
      <div className="shrink-0">
        <div className="rule" />
        <div
          className="flex items-center justify-between gap-8 mt-4 mono tracking-[0.04em]"
          style={{ fontSize: "clamp(1.4rem, 1.6vw, 2rem)" }}
        >
          <p className="text-[var(--muted)] truncate">
            <span className="font-bold text-[var(--ink)]">Can&apos;t make it? Find us anyway.</span>{" "}
            info@cimesh.net · www.cimesh.net
          </p>
          <p className="text-[var(--amber)] font-bold whitespace-nowrap">One node at a time.</p>
        </div>
      </div>
    </div>
  );
}
