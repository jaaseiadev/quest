"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

export type LogoutButtonProps = Omit<ButtonProps, "children" | "onClick">;

export function LogoutButton({ className, ...props }: LogoutButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setIsSubmitting(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error: signOutError } = await supabase.auth.signOut();

    setIsSubmitting(false);

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    router.push("/auth/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("px-3", className)}
      onClick={handleLogout}
      disabled={isSubmitting}
      title={error || "Log out"}
      aria-label="Log out"
      {...props}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      <span className="hidden xl:inline">{isSubmitting ? "Exiting" : "Logout"}</span>
    </Button>
  );
}
