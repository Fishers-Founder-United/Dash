"use client";

import SlideHeader from "./SlideHeader";

/**
 * Live LoRa mesh activity for the region, embedded from the OKI Mesh Alliance
 * map (CoreScope). Shows packets propagating between repeaters in real time.
 *
 * Embedded rather than rebuilt: map.okimesh.org sets no X-Frame-Options and no
 * frame-ancestors CSP, so it frames cleanly. Its JSON API is public but sends
 * no Access-Control-Allow-Origin, so a browser on github.io cannot call it
 * directly — a native rebuild would need the data mirrored into public/data via
 * a sync script, the way events and news already work.
 *
 * The Lab runs a node on this mesh: IN.HAM.IndianaIoT.com, at the Fishers site.
 */

const MESH_MAP_URL = "https://map.okimesh.org/live";

export default function MeshSlide() {
  return (
    <div className="flex flex-col h-full px-16 py-12">
      <SlideHeader
        channel="rf0 · Mesh Telemetry"
        title="LoRa Mesh"
        meta="OKIMESH · LIVE PACKETS"
      />

      <div className="flex-1 mt-8 min-h-0 rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden relative">
        {/* Fallback sits underneath: if the frame ever stops painting (they add
            framing protection, or the site is down) the panel shows this
            instead of a blank rectangle on the wall. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-12 text-center">
          <p
            className="mono text-[var(--faint)] tracking-[0.06em]"
            style={{ fontSize: "clamp(1.5rem, 1.8vw, 2rem)" }}
          >
            MESH MAP UNAVAILABLE
          </p>
          <p
            className="text-[var(--ink)] font-medium"
            style={{ fontSize: "clamp(2rem, 2.5vw, 3rem)" }}
          >
            map.okimesh.org
          </p>
        </div>

        <iframe
          src={MESH_MAP_URL}
          title="OKI Mesh live packet map"
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full border-0 bg-white"
        />
      </div>

      <p
        className="mono text-[var(--accent)] tracking-[0.06em] mt-6 shrink-0"
        style={{ fontSize: "clamp(1.5rem, 1.8vw, 2rem)" }}
      >
        IN.HAM.INDIANAIOT.COM · NODE ONLINE AT THE LAB
      </p>
    </div>
  );
}
