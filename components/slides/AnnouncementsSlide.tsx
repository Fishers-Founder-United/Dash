"use client";

import type { Announcement } from "@/lib/types";

const REPO_URL = "indianaiot.com";
const CONTRIBUTE_URL = "https://indianaiot.com";

interface AnnouncementsSlideProps {
  announcements: Announcement[];
}

export default function AnnouncementsSlide({
  announcements,
}: AnnouncementsSlideProps) {
  return (
    <div className="flex flex-col h-full px-12 py-10 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-cyan-400 font-black tracking-widest uppercase"
          style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
        >
          Community Board
        </h2>
      </div>

      <div className="h-px bg-cyan-500/20" />

      <div className="flex flex-1 gap-12 items-start">
        {/* Announcements list */}
        <div className="flex flex-col gap-5 flex-1">
          {announcements.length > 0 ? (
            announcements.map((a) => (
              <div
                key={a.id}
                className="bg-white/5 border border-white/8 rounded-2xl p-6"
              >
                <p
                  className="text-white leading-relaxed"
                  style={{ fontSize: "clamp(1.25rem, 2vw, 2rem)" }}
                >
                  {a.text}
                </p>
                {a.url && (
                  <p
                    className="text-cyan-400/60 font-mono mt-3"
                    style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.4rem)" }}
                  >
                    {a.url.replace(/^https?:\/\//, "")}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p
                className="text-white/30"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
              >
                No announcements
              </p>
            </div>
          )}
        </div>

        {/* Contribute panel */}
        <div className="shrink-0 w-80 flex flex-col gap-6 items-center bg-cyan-500/8 border border-cyan-500/20 rounded-2xl p-8">
          {/* Simple QR placeholder — styled URL block */}
          <div className="w-52 h-52 bg-white rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <p className="text-black text-xs font-bold leading-tight">
                QR CODE
              </p>
              <p className="text-black/50 text-xs mt-1">
                Scan to contribute
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-cyan-400 font-bold text-xl">
              Learn More
            </p>
            <p className="text-white/50 text-lg mt-2 font-mono break-all">
              {REPO_URL}
            </p>
            <p className="text-white/30 text-base mt-3 leading-snug">
              9059 Technology Lane<br />Fishers, IN 46038
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
