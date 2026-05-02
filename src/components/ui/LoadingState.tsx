import { cn } from "@/lib/utils";

export type LoadingStateProps = {
  label?: string;
  rows?: number;
  className?: string;
};

export function LoadingState({
  label = "Loading",
  rows = 3,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn("space-y-3", className)} aria-busy="true" aria-live="polite">
      <p className="text-label-caps text-muted-foreground">{label}</p>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="h-12 border border-border bg-surface-container-low"
        />
      ))}
    </div>
  );
}
