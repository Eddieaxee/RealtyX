"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface MapProperty {
  id: string;
  title: string;
  lat: number;
  lng: number;
  location: string;
  tokenPriceUSD: number;
  expectedReturn: number | null;
  funded: number;
  image: string;
}

interface MultiPropertyMapProps {
  properties: MapProperty[];
  centerLat: number;
  centerLng: number;
  onPropertyClick?: (id: string) => void;
}

export default function MultiPropertyMap({
  properties,
  centerLat,
  centerLng,
  onPropertyClick,
}: MultiPropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const L = await import("leaflet");

        // Fix default marker icon issue with webpack/vite
        delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        if (!isMounted || !mapRef.current) return;

        mapRef.current.innerHTML = "";

        const map = L.map(mapRef.current, {
          center: [centerLat, centerLng],
          zoom: 7,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Custom gold marker icon
        const goldIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            width: 28px; height: 28px; 
            background: linear-gradient(135deg, #E2B93B, #B89221); 
            border: 2px solid #fff; 
            border-radius: 50% 50% 50% 0; 
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            display: flex; align-items: center; justify-content: center;
          "><span style="transform: rotate(45deg); color: #000; font-size: 10px; font-weight: bold;">₦</span></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
        });

        // Add a marker for each property
        const bounds = L.latLngBounds([]);

        properties.forEach((prop) => {
          L.marker([prop.lat, prop.lng], { icon: goldIcon })
            .addTo(map)
            .bindPopup(
              `<div style="font-family: -apple-system, sans-serif; padding: 4px; min-width: 180px;">
                <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px; color: #1a1a1a;">${prop.title}</div>
                <div style="font-size: 11px; color: #666; margin-bottom: 6px;">${prop.location}</div>
                <div style="display: flex; gap: 12px; font-size: 11px; margin-bottom: 4px;">
                  <div><span style="color: #999;">Token:</span> <strong style="color: #E2B93B;">$${prop.tokenPriceUSD.toLocaleString()}</strong></div>
                  <div><span style="color: #999;">Return:</span> <strong style="color: #16a34a;">${prop.expectedReturn ?? 0}%</strong></div>
                </div>
                <div style="font-size: 10px; color: #999;">Funded: ${prop.funded}%</div>
                ${onPropertyClick ? `<button onclick="window.__openProperty('${prop.id}')" style="margin-top: 6px; width: 100%; padding: 4px 8px; background: #E2B93B; color: #000; border: none; border-radius: 4px; font-size: 10px; font-weight: 600; cursor: pointer;">View Details →</button>` : ""}
              </div>`
            );

          bounds.extend([prop.lat, prop.lng]);
        });

        // Fit map to show all markers
        if (properties.length > 1) {
          map.fitBounds(bounds, { padding: [40, 40] });
        } else if (properties.length === 1) {
          map.setView([properties[0].lat, properties[0].lng], 14);
        }

        // Expose a global handler for popup button clicks
        if (onPropertyClick) {
          (window as unknown as Record<string, unknown>).__openProperty = (id: string) => {
            onPropertyClick(id);
          };
        }

        mapInstance.current = map;

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
  }, [properties, centerLat, centerLng, onPropertyClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[500px] rounded-2xl"
      style={{ zIndex: 1 }}
    />
  );
}