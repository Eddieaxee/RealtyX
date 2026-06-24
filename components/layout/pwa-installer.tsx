"use client";

import { useEffect, useState, useCallback } from "react";
import { Download } from "lucide-react";

/**
 * PWA Installer - Handles the beforeinstallprompt event and wires
 * the "Launch App" button to trigger the native install prompt.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (display-mode: standalone)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Track installation completion
    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallable(false);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
    return result.outcome === "accepted";
  }, [deferredPrompt]);

  return { isInstallable, isInstalled, install };
}

/**
 * PWA Install Button - Renders a download button when the app is installable.
 */
export function PWAInstallButton({ className = "" }: { className?: string }) {
  const { isInstallable, install } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button
      onClick={install}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B] font-bold text-sm hover:bg-[#E2B93B]/20 transition-all ${className}`}
      title="Install RealtyX App"
    >
      <Download className="w-4 h-4" />
      Launch App
    </button>
  );
}

/**
 * PWA Registration - Call this in the root layout to register the service worker.
 */
export function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Register service worker on mount
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });
          console.log("Service Worker registered with scope:", registration.scope);
        } catch (err) {
          console.warn("Service Worker registration failed:", err);
        }
      };
      registerSW();
    }
  }, []);

  return null; // This component does not render anything
}