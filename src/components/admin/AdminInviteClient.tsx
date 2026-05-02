"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

import { Button, Card, Input, Label, PageHeader } from "@/components/ui";

type AdminInviteResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

export function AdminInviteClient() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "danger";
    message: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteCode }),
      });
      const json = (await response.json()) as AdminInviteResponse;

      if (!json.success) {
        throw new Error(json.error);
      }

      setInviteCode("");
      setFeedback({
        tone: "success",
        message: json.message,
      });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      setFeedback({
        tone: "danger",
        message: error instanceof Error ? error.message : "Invite code failed.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Admin / Invite"
        title="Invite Code Verification"
        description="Submit the configured server-side admin invite code, then continue to the admin command center."
      />

      <Card className="max-w-2xl">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 border-b border-border pb-5">
            <div className="border border-primary bg-primary/10 p-2 text-primary-soft">
              <KeyRound className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Admin Invite Endpoint
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The code is compared only in the route handler.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-invite-code">Invite Code</Label>
            <Input
              id="admin-invite-code"
              type="password"
              value={inviteCode}
              required
              placeholder="Enter invite code"
              onChange={(event) => setInviteCode(event.target.value)}
            />
          </div>

          {feedback ? (
            <div
              className={`border p-3 text-sm font-semibold ${
                feedback.tone === "success"
                  ? "border-success bg-success/10 text-success"
                  : "border-danger bg-danger/10 text-danger"
              }`}
              role="status"
            >
              {feedback.message}
            </div>
          ) : null}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Verifying" : "Verify Code"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
