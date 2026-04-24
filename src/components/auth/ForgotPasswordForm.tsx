"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

import { Button, Input, Label } from "@/components/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = new URL("/auth/login", window.location.origin);
    redirectTo.searchParams.set("message", "Password reset email confirmed.");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo.toString(),
    });

    setIsSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage("Recovery transmission sent. Check your email.");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="operative@campus.edu"
          required
        />
      </div>

      {error ? (
        <p className="border border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="border border-success bg-success/10 px-4 py-3 text-sm text-success">
          {message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Sending" : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Signal restored?{" "}
        <Link
          href="/auth/login"
          className="font-display font-bold uppercase text-primary-soft transition-colors hover:text-primary"
        >
          Return To Login
        </Link>
      </p>
    </form>
  );
}
