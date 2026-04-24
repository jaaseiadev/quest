import { cn, clamp } from "@/lib/utils";

export type SegmentedProgressProps = {
  value: number;
  max: number;
  segments?: number;
  label?: string;
  className?: string;
};

export function SegmentedProgress({
  value,
  max,
  segments = 10,
  label,
  className,
}: SegmentedProgressProps) {
  const safeMax = Math.max(max, 1);
  const safeSegments = Math.max(segments, 1);
  const percentage = clamp(value / safeMax, 0, 1);
  const filledSegments = Math.round(percentage * safeSegments);

  return (
    <div className={cn("space-y-3", className)}>
      {label ? (
        <div className="flex items-center justify-between gap-4 text-label-caps">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-secondary">
            {value} / {max} XP
          </span>
        </div>
      ) : null}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${safeSegments}, minmax(0, 1fr))` }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamp(value, 0, max)}
      >
        {Array.from({ length: safeSegments }, (_, index) => {
          const active = index < filledSegments;

          return (
            <div
              key={index}
              className={cn(
                "h-2 border border-border",
                active ? "border-secondary bg-secondary" : "bg-surface-container-high",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
