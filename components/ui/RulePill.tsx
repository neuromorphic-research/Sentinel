import { cn } from "@/lib/utils";

export function RulePill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "ignore";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] tracking-wide",
        tone === "accent" && "border-accent/30 bg-accent/10 text-accent",
        tone === "ignore" && "border-hairline bg-elevated text-ink-faint line-through decoration-ink-faint/50",
        tone === "neutral" && "border-hairline-strong bg-elevated text-ink-soft",
        className
      )}
    >
      {children}
    </span>
  );
}
