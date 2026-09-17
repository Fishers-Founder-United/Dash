"use client";

import { useEffect, useRef, useState } from "react";

const LAT = 39.9556;
const LON = -86.0131;
const ZOOM = 8; // ~50 mile view

// NWS radar via NOAA/NCEP GeoServer WMS — the same layer behind radar.weather.gov.
// conus_bref_qcd = CONUS base reflectivity, quality-controlled. No API key.
// Updates every ~2 min on NWS's side.
const NWS_WMS_URL = "https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows";
const NWS_WMS_LAYER = "conus_bref_qcd";

export default function WeatherRadarMap() {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const radarLayerRef = useRef<import("leaflet").TileLayer.WMS | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  // Init map once
  useEffect(() => {
    let mounted = true;
    import("leaflet").then((L) => {
      if (!mapDivRef.current || mapRef.current || !mounted) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: "", iconUrl: "", shadowUrl: "" });

      const map = L.map(mapDivRef.current, {
        center: [LAT, LON],
        zoom: ZOOM,
        minZoom: ZOOM,
        maxZoom: ZOOM,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      });
      mapRef.current = map;

      // Light base map
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png").addTo(map);

      // NWS radar overlay
      const radar = L.tileLayer.wms(NWS_WMS_URL, {
        layers: NWS_WMS_LAYER,
        format: "image/png",
        transparent: true,
        opacity: 0.8,
        zIndex: 10,
      });
      radar.addTo(map);
      radarLayerRef.current = radar;

      // IoT Lab marker
      L.circleMarker([LAT, LON], {
        radius: 10,
        fillColor: "#0d9488",
        color: "#ffffff",
        weight: 2.5,
        fillOpacity: 1,
      })
        .bindTooltip("Indiana IoT Lab", {
          permanent: true,
          direction: "right",
          offset: [14, 0],
          className: "radar-label",
        })
        .addTo(map);

      // 20-mile radius ring
      L.circle([LAT, LON], {
        radius: 32186,
        color: "#0d9488",
        fillColor: "transparent",
        weight: 2,
        opacity: 0.3,
        dashArray: "6 4",
      }).addTo(map);

      setLastUpdate(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        radarLayerRef.current = null;
      }
    };
  }, []);

  // Refresh radar every 10 minutes. A changing extra param (leaflet passes
  // unknown keys through to the query string) forces fresh GetMap requests
  // instead of re-drawing from the browser cache.
  useEffect(() => {
    const interval = setInterval(() => {
      radarLayerRef.current?.setParams({ layers: NWS_WMS_LAYER, _t: Date.now() } as import("leaflet").WMSParams);
      setLastUpdate(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 overflow-hidden">
        <div ref={mapDivRef} className="h-full w-full" />

        {/* Updated timestamp */}
        {lastUpdate && (
          <div className="hud absolute top-4 right-4 z-[1000] flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-[8px] px-4 py-2 border-2 border-[var(--line)]">
            <span className="dot shrink-0" />
            <span className="mono text-[var(--ink)] font-semibold tracking-[0.06em]" style={{ fontSize: "clamp(1.8rem, 2.2vw, 2.8rem)" }}>{lastUpdate}</span>
            <span className="readout text-[var(--faint)]" style={{ fontSize: "clamp(1.4rem, 1.7vw, 1.9rem)" }}>RADAR</span>
          </div>
        )}

        <div className="mono uppercase tracking-[0.12em] absolute bottom-4 left-4 z-[1000] text-[var(--muted)] bg-white/75 rounded-[6px] px-3 py-1.5 border-2 border-[var(--line)]" style={{ fontSize: "clamp(1.4rem, 1.7vw, 1.9rem)" }}>
          ~50 MI · NWS RADAR
        </div>
      </div>
    </div>
  );
}
