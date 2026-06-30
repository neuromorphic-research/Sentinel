"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Mono UTC-ish wall clock. Renders nothing until mounted so server and client
 * markup match (avoids hydration mismatch from Date()).
 */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-2 rounded-md border border-hairline bg-panel-2 px-2.5 py-1 text-[11px] text-ink-soft",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-safe" />
      {now ?? "--:--:--"}
      <span className="text-ink-faint">UTC</span>
    </span>
  );
}
