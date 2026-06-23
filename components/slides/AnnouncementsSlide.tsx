"use client";

import { QRCodeSVG } from "qrcode.react";
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
          className="text-teal-600 font-black tracking-widest uppercase"
          style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
        >
          Community Board
        </h2>
      </div>

      <div className="h-[2px] bg-teal-200" />

      <div className="flex flex-1 gap-12 items-start">
        {/* Announcements list */}
        <div className="flex flex-col gap-5 flex-1">
          {announcements.length > 0 ? (
            announcements.map((a) => (
              <div
                key={a.id}
                className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-sm"
              >
                <p
                  className="text-slate-700 leading-relaxed"
                  style={{ fontSize: "clamp(1.25rem, 2vw, 2rem)" }}
                >
                  {a.text}
                </p>
                {a.url && (
                  <p
                    className="text-teal-500 font-mono mt-3"
                    style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.6rem)" }}
                  >
                    {a.url.replace(/^https?:\/\//, "")}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p
                className="text-slate-400"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
              >
                No announcements
              </p>
            </div>
          )}
        </div>

        {/* Contribute panel — enlarged for TV readability */}
        <div className="shrink-0 w-96 flex flex-col gap-6 items-center bg-teal-50 border-2 border-teal-200 rounded-2xl p-10">
          {/* QR code linking to indianaiot.com */}
          <div className="p-4 bg-white rounded-2xl">
            <QRCodeSVG
              value={CONTRIBUTE_URL}
              size={280}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>
          <div className="text-center">
            <p className="text-teal-600 font-bold" style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)" }}>
              Scan to Learn More
            </p>
            <p className="text-slate-500 mt-2 font-mono break-all" style={{ fontSize: "clamp(1.3rem, 1.6vw, 1.6rem)" }}>
              {REPO_URL}
            </p>
            <p className="text-slate-400 mt-3 leading-snug" style={{ fontSize: "clamp(1.3rem, 1.6vw, 1.6rem)" }}>
              9059 Technology Lane<br />Fishers, IN 46038
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
