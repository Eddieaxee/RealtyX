"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

export function KYCStatusListener({ userId }: { userId: string }) {
  useEffect(() => {
    // Fallback to SSE (project already has /api/sse/notifications)
    // This avoids bundling Pusher client SDK if it's not installed.
    const es = new EventSource("/api/sse/notifications");

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type !== "notification") return;

        // For KYC notifications we use type=KYC and metadata.status
        const isApproved =
          payload?.data?.type === "KYC" &&
          payload?.data?.metadata?.status === "APPROVED";

        if (!payload?.data) return;

        toast(isApproved ? "Identity Verified" : "Identity Review Required", {
          description: isApproved
            ? "Your documents have been approved. You can now start investing."
            : "Your submission requires further review. Check your dashboard.",
          icon: isApproved ? (
            <CheckCircle2 className="text-emerald-400" />
          ) : (
            <XCircle className="text-red-400" />
          ),
          duration: 8000,
          action: {
            label: "View Dashboard",
onClick: () => (window.location.href = "/kyc"),
          },
        });
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      // Keep silent; SSE will reconnect.
    };

    return () => {
      es.close();
    };
  }, [userId]);

  return null;
}
