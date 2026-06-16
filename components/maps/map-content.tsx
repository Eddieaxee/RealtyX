"use client";

import { useEffect, useRef } from "react";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

interface MapContentProps {
  lat: number;
  lng: number;
  propertyName: string;
}

export default function MapContent({ lat, lng, propertyName }: MapContentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const L = await import("leaflet");

        // Fix default marker icon issue with webpack/vite
        delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        if (!isMounted || !mapRef.current) return;

        // Clear any existing map content
        mapRef.current.innerHTML = "";

        const map = L.map(mapRef.current, {
          center: [lat, lng],
          zoom: 14,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Add a marker for the property
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            `<div style="font-family:monospace;font-size:12px;padding:4px;"><strong>${propertyName}</strong><br/>${lat.toFixed(4)}, ${lng.toFixed(4)}</div>`
          )
          .openPopup();

        mapInstance.current = map;

        // Force resize after mount
        setTimeout(() => {
          map.invalidateSize();
        }, 300);
      } catch (err) {
        console.error("Failed to load Leaflet:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        try {
          (mapInstance.current as { remove: () => void }).remove();
        } catch {
          // ignore cleanup errors
        }
        mapInstance.current = null;
      }
    };
  }, [lat, lng, propertyName]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[340px] rounded-none"
      style={{ zIndex: 1 }}
    />
  );
}
