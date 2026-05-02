import { Badge } from "@/components/ui";

export type WelcomeSectionProps = {
  displayName: string;
  rankLabel: string;
};

export function WelcomeSection({ displayName, rankLabel }: WelcomeSectionProps) {
  return (
    <section className="mb-8 border border-border bg-surface-container-low p-5 md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-3">
          <p className="text-label-caps text-primary">Student Command</p>
          <h1 className="break-words text-headline-xl text-foreground">
            Welcome back, {displayName}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Track your rank, quest applications, and next available operations from
            one command console.
          </p>
        </div>
        <Badge variant="rank">{rankLabel}</Badge>
      </div>
    </section>
  );
}
