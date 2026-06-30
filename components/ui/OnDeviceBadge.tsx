import { CloudOff, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function OnDeviceBadge({
  className,
  size = "md",
  variant = "default",
}: {
  className?: string;
  size?: "sm" | "md";
  variant?: "default" | "offline";
}) {
  const offline = variant === "offline";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono uppercase tracking-[0.14em]",
        size === "sm" ? "text-[9px]" : "text-[10px]",
        offline
          ? "border-pending/30 bg-pending/10 text-pending"
          : "border-accent/30 bg-accent/10 text-accent",
        className
      )}
    >
      {offline ? (
        <CloudOff className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      ) : (
        <Cpu className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      )}
      {offline ? "Edge online · Cloud N/A" : "On-device · No cloud"}
    </span>
  );
}
