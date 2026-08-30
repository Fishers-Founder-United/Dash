"use client";

import { QRCodeSVG } from "qrcode.react";
import SlideHeader from "./SlideHeader";
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
      <SlideHeader
        channel="Community · Board"
        title="Community Board"
        meta={`${String(announcements.length).padStart(2, "0")} POSTED`}
      />

      <div className="flex flex-1 gap-12 items-start mt-2">
        {/* Announcements list */}
        <div className="flex flex-col gap-5 flex-1">
          {announcements.length > 0 ? (
            announcements.map((a) => (
              <div
                key={a.id}
                className="bg-white border-2 border-l-[6px] border-[var(--line)] border-l-[var(--accent)] rounded-[10px] p-8"
              >
                <p
                  className="text-[var(--ink)] leading-relaxed"
                  style={{ fontSize: "clamp(2rem, 2.5vw, 3rem)" }}
                >
                  {a.text}
                </p>
                {a.url && (
                  <p
                    className="mono text-[var(--accent)] tracking-[0.04em] mt-3"
                    style={{ fontSize: "clamp(1.8rem, 2vw, 2.5rem)" }}
                  >
                    &gt; {a.url.replace(/^https?:\/\//, "")}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p
                className="mono uppercase tracking-[0.15em] text-[var(--faint)]"
                style={{ fontSize: "clamp(2rem, 3vw, 4rem)" }}
              >
                No announcements
              </p>
            </div>
          )}
        </div>

        {/* Contribute panel — enlarged for TV readability */}
        <div className="hud shrink-0 w-[28rem] flex flex-col gap-6 items-center bg-[var(--accent-tint)] border-2 border-[var(--line)] rounded-[10px] p-10">
          {/* QR code linking to indianaiot.com */}
          <div className="p-4 bg-white rounded-[8px]">
            <QRCodeSVG
              value={CONTRIBUTE_URL}
              size={320}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>
          <div className="text-center">
            <p className="mono uppercase tracking-[0.12em] text-[var(--accent)] font-bold" style={{ fontSize: "clamp(1.7rem, 2.1vw, 2.4rem)" }}>
              Scan to Learn More
            </p>
            <p className="mono text-[var(--muted)] mt-2 break-all" style={{ fontSize: "clamp(1.5rem, 1.8vw, 2rem)" }}>
              {REPO_URL}
            </p>
            <p className="mono text-[var(--faint)] mt-3 leading-snug tracking-[0.05em]" style={{ fontSize: "clamp(1.4rem, 1.7vw, 1.9rem)" }}>
              9059 Technology Lane<br />Fishers, IN 46038
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
