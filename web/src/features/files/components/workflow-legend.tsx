"use client";

type Props = {
  className?: string;
  compact?: boolean;
};

const STEPS = [
  "Manifeste importe",
  "Debarquement",
  "Inspection et expertise",
  "Dossier cloture",
] as const;

export function WorkflowLegend({ className = "", compact = false }: Props) {
  return (
    <div className={`rounded-md border border-border bg-card p-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">WF</span>
        <span>Workflow</span>
        <span className="text-muted-foreground">(ordre)</span>
      </div>
      <ol className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground text-xs font-semibold ring-1 ring-border">
              {i + 1}
            </span>
            <span className={compact ? "" : "font-medium text-foreground"}>{label}</span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 hidden sm:inline text-muted-foreground">→</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export const WORKFLOW_STEPS_LIST = [...STEPS];
