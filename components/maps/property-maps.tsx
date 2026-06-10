"use client";

import { useState, useEffect, useRef } from "react";
import {
  Map,
  MapPin,
  Navigation,
  Building,
  ShieldCheck,
  Footprints,
  School,
  HeartPulse,
} from "lucide-react";

interface MapSystemProps {
  lat: number;
  lng: number;
  propertyName: string;
  neighborhood: string;
}

export function PropertyMapSystem({
  lat,
  lng,
  propertyName,
  neighborhood,
}: MapSystemProps) {
  const [mapProvider, setMapProvider] = useState<"MAPBOX" | "GOOGLE">("MAPBOX");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Premium metrics tracking localized property surrounding vectors
  const analytics = {
    walkScore: 89,
    safetyIndex: "Premium / Low Risk",
    transitAccess: "Excellent",
    infrastructure: [
      {
        name: "Eko Atlantic Marina & Yacht Club",
        distance: "450m",
        icon: Navigation,
        type: "Leisure",
      },
      {
        name: "The Institutional Financial Center",
        distance: "1.2km",
        icon: Building,
        type: "Business",
      },
      {
        name: "Admiralty Medical Outpost",
        distance: "800m",
        icon: HeartPulse,
        type: "Health",
      },
      {
        name: "International Tech Academy",
        distance: "2.1km",
        icon: School,
        type: "Education",
      },
    ],
  };

  // Initialize Mapbox map when component mounts
  useEffect(() => {
    if (mapProvider !== "MAPBOX" || !mapContainerRef.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) {
      // No Mapbox token available, use fallback
      setMapLoaded(false);
      return;
    }

    let map: { remove?: () => void; on?: (event: string, cb: () => void) => void; addControl?: (control: unknown, position: string) => void } | null = null;

    async function initMap() {
      try {
        const mapboxgl = await import("mapbox-gl");
        // Keep typing loose without `any` while supporting common ESM/CJS shapes
        const mbgl = mapboxgl as unknown as {
          default?: { accessToken?: string };
          accessToken?: string;
          Map?: unknown;
          Marker?: unknown;
          Popup?: unknown;
          NavigationControl?: unknown;
        };
        if (mbgl.default?.accessToken !== undefined) {
          mbgl.default.accessToken = mapboxToken;
        } else {
          mbgl.accessToken = mapboxToken;
        }

        if (!mapContainerRef.current) return;

        const MapCtor = (
          mapboxgl as unknown as { Map?: new (...args: unknown[]) => unknown }
        ).Map;
        const MarkerCtor = (
          mapboxgl as unknown as {
            Marker?: new (...args: unknown[]) => unknown;
          }
        ).Marker;
        const PopupCtor = (
          mapboxgl as unknown as { Popup?: new (...args: unknown[]) => unknown }
        ).Popup;
        const NavCtor = (
          mapboxgl as unknown as {
            NavigationControl?: new (...args: unknown[]) => unknown;
          }
        ).NavigationControl;

        if (!MapCtor) return;

        map = new MapCtor({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [Number(lng), Number(lat)],
          zoom: 15,
          pitch: 45,
          bearing: -17.6,
        }) as { remove?: () => void; on?: (event: string, cb: () => void) => void; addControl?: (control: unknown, position: string) => void };

        // Add marker for the property
        if (MarkerCtor && PopupCtor) {
          const marker = new (MarkerCtor as new (opts: Record<string, unknown>) => {
            setLngLat: (coords: number[]) => { setPopup: (popup: unknown) => { addTo: (target: unknown) => void } };
          })({
            color: "#E2B93B",
            scale: 1.2,
          });
          marker
            .setLngLat([Number(lng), Number(lat)])
            .setPopup(
              new (PopupCtor as new (opts: Record<string, unknown>) => { setHTML: (html: string) => unknown })({ offset: 25 }).setHTML(
                `<div class="map-popup-content">${propertyName}</div>`,
              ),
            )
            .addTo(map as unknown as { addTo?: (m: unknown) => unknown });
        }

        // Add navigation controls
        if (
          map &&
          NavCtor &&
          typeof map.addControl === "function"
        ) {
          map.addControl(new (NavCtor as new () => unknown)(), "top-right");
        }

        if (map.on) {
          map.on("load", () => {
            setMapLoaded(true);
          });
        }
      } catch {
        console.error("Failed to load Mapbox");
        setMapLoaded(false);
      }
    }

    initMap();

    return () => {
      if (map?.remove) map.remove();
    };
  }, [mapProvider, lat, lng, propertyName]);

  return (
    <div className="bg-[#0D0E12] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      {/* Map Interactive Frame Tabs */}
      <div className="p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 bg-[#0D0E12]/90">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Map className="w-4 h-4 text-[#E2B93B]" /> Geospatial Location
            Network
          </h3>
          <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
            Coordinates: {lat}, {lng}
          </p>
        </div>

        {/* Map Engine Provider Selection Swaps */}
        <div className="flex gap-1 bg-[#090A0C] border border-white/5 p-1 rounded-xl font-mono text-[10px]">
          <button
            onClick={() => setMapProvider("MAPBOX")}
            className={`px-2.5 py-1 rounded-lg transition-all font-bold ${mapProvider === "MAPBOX" ? "bg-white/10 text-white" : "text-neutral-500"}`}
          >
            Mapbox Engine
          </button>
          <button
            onClick={() => setMapProvider("GOOGLE")}
            className={`px-2.5 py-1 rounded-lg transition-all font-bold ${mapProvider === "GOOGLE" ? "bg-white/10 text-white" : "text-neutral-500"}`}
          >
            Google Engine
          </button>
        </div>
      </div>

      {/* Visual Workspace Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Left Side Visual Frame - Map Graphic Representation */}
        <div className="lg:col-span-2 min-h-[340px] bg-[#111318] relative flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5">
          {/* Mapbox Map Container */}
          {mapProvider === "MAPBOX" && (
            <div
              ref={mapContainerRef}
              className="absolute inset-0 w-full h-full map-container"
            />
          )}

          {/* Fallback when no Mapbox token or Google selected */}
          {(!mapLoaded || mapProvider === "GOOGLE") && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="text-center z-10 p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E2B93B]/10 border border-[#E2B93B]/30 flex items-center justify-center mx-auto animate-pulse">
                  <MapPin className="w-6 h-6 text-[#E2B93B]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wider">
                    {mapProvider === "MAPBOX"
                      ? "Mapbox API Interface"
                      : "Google Maps API Interface"}
                  </span>
                  <h4 className="text-xs font-bold text-white font-mono mt-1 px-3 py-1.5 rounded-lg bg-[#090A0C] border border-white/5 inline-block">
                    {mapProvider === "MAPBOX"
                      ? "mapbox://styles/mapbox/dark-v11"
                      : "google.maps.MapTypeId.DARK"}
                  </h4>
                </div>
                <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                  Rendering localized layer structures for{" "}
                  <strong>{propertyName}</strong> located in {neighborhood}.
                </p>
                <p className="text-[9px] text-neutral-500 font-mono">
                  Lat: {lat} | Lng: {lng}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Frame Panel - Neighborhood Analytics Metric Blocks */}
        <div className="p-5 space-y-5 bg-[#0D0E12]">
          <div>
            <h4 className="text-xs font-mono font-bold text-[#E2B93B] uppercase tracking-wider">
              Neighborhood Indices
            </h4>
            <div className="grid grid-cols-2 gap-3 mt-2.5 font-mono">
              <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                <span className="text-[9px] text-neutral-500 block uppercase flex items-center gap-1">
                  <Footprints className="w-3 h-3 text-emerald-400" /> Walk Score
                </span>
                <span className="text-lg font-bold text-white block mt-0.5">
                  {analytics.walkScore}/100
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                <span className="text-[9px] text-neutral-500 block uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" /> Safety
                  Core
                </span>
                <span className="text-xs font-bold text-white block mt-1.5 truncate">
                  {analytics.safetyIndex}
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Proximity Distances Matrix */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              Nearby Physical Infrastructure
            </h4>
            <div className="space-y-2">
              {analytics.infrastructure.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#090A0C]/50 border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 rounded-lg bg-white/5 text-neutral-400 shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-neutral-200 truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#E2B93B] shrink-0 ml-2">
                      {item.distance}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
