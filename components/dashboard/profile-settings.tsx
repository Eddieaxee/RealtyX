"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// 1. Explicit clean type instead of using "any"
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string;
  address?: string;
}

export function ProfileSettings() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (session?.user) {
      // Safe type assertion to read custom model properties
      const userPayload = session.user as ExtendedUser;
      const nameParts = userPayload.name?.split(" ") || ["", ""];

      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setPhone(userPayload.phone || "");
      setAddress(userPayload.address || "");
    }
  }, [session]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          phone,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong saving details");
      }

      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: `${firstName} ${lastName}`.trim(),
        },
      });

      setStatusMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      // Safe dynamic error resolution matching type requirements
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      setStatusMessage({ type: "error", text: message });
    } finally {
      setIsLoading(false);
    }
  };

  const initials =
    `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "UX";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6"
    >
      <h2 className="text-lg font-semibold mb-6">Profile Information</h2>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-2xl font-bold uppercase">
            {initials}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform"
            title="Change profile picture"
            aria-label="Change profile picture"
          >
            <Camera className="w-3 h-3 text-white" />
          </button>
        </div>
        <div>
          <h3 className="font-semibold capitalize">
            {session?.user?.name || "User Account"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {session?.user?.email}
          </p>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-500 border border-green-500/20 mt-1">
            <CheckCircle className="w-3 h-3" /> Active Session
          </span>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-sm mb-4 border ${
            statusMessage.type === "success"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={session?.user?.email || ""}
              className="pl-10 bg-muted/30 text-muted-foreground cursor-not-allowed"
              disabled
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Residential Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter physical address"
              className="pl-10"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="gradient-gold text-white hover:opacity-90 w-full sm:w-auto min-w-[140px]"
        >
          {isLoading ? <LoadingSpinner /> : "Save Changes"}
        </Button>
      </form>
    </motion.div>
  );
}
