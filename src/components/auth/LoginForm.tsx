"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { AuthError } from "@supabase/supabase-js";
import { ArrowRight, KeyRound } from "lucide-react";

import { Button, Input, Label } from "@/components/ui";
import { getSafeRedirectPath } from "@/lib/auth-redirect";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type LoginFormProps = {
  nextPath?: string;
  initialError?: string;
  initialMessage?: string;
};

export function LoginForm({
  nextPath,
  initialError,
  initialMessage,
}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthSubmitting, setIsOAuthSubmitting] = useState(false);

  const resolvedNextPath = getSafeRedirectPath(nextPath);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      logAuthError(signInError);
      setError(getLoginErrorMessage(signInError));
      return;
    }

    if (!data.session) {
      setError(
        "Login did not return a browser session. Check Supabase email confirmation and project settings.",
      );
      return;
    }

    router.replace(resolvedNextPath);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setError("");
    setMessage("");
    setIsOAuthSubmitting(true);

    const redirectTo = new URL("/auth/oauth-callback", window.location.origin);
    redirectTo.searchParams.set("next", resolvedNextPath);

    const supabase = createSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.toString(),
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setIsOAuthSubmitting(false);
    }
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

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/auth/forgot-password"
            className="font-display text-xs font-bold uppercase text-secondary transition-colors hover:text-secondary-hover"
          >
            Forgot
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Access key"
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

      <div className="grid gap-3">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Verifying" : "Enter Command Center"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={isOAuthSubmitting}
          onClick={handleGoogleSignIn}
        >
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          {isOAuthSubmitting ? "Opening Google" : "Continue With Google"}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New operative?{" "}
        <Link
          href="/auth/sign-up"
          className="font-display font-bold uppercase text-primary-soft transition-colors hover:text-primary"
        >
          Create Account
        </Link>
      </p>
    </form>
  );
}

function getLoginErrorMessage(error: AuthError) {
  const message = error.message.toLowerCase();

  if (error.code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Email is not confirmed. Confirm the user in Supabase or disable email confirmations for local development.";
  }

  if (
    error.code === "invalid_credentials" ||
    message.includes("invalid login credentials")
  ) {
    return "Invalid email or password.";
  }

  if (message.includes("fetch") || message.includes("failed to fetch")) {
    return "Authentication service is unreachable. Check the Supabase URL and public key.";
  }

  return error.message;
}

function logAuthError(error: AuthError) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.warn("[auth] Supabase login failed", {
    code: error.code,
    status: error.status,
    name: error.name,
    message: error.message,
  });
}
