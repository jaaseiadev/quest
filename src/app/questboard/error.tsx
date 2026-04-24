"use client";

import { RotateCcw } from "lucide-react";

import { AppShell } from "@/components/shared";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function QuestBoardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppShell>
      <Card variant="danger" role="alert">
        <CardHeader>
          <p className="text-label-caps text-danger">Quest Board Error</p>
          <CardTitle>Operations failed to load</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-danger">
            {error.message || "The quest board request could not be completed."}
          </p>
          <Button className="mt-4" variant="danger" onClick={reset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}

