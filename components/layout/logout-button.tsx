"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/auth/signin" })} // Redirects to your app/auth/signin route
      variant="ghost"
      className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors w-full justify-start px-3"
    >
      <LogOut className="w-4 h-4" />
      <span>Log Out</span>
    </Button>
  );
}
