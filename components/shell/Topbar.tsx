"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { siteCount, cameraCount } from "@/mock";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function Topbar() {
  const pathname = usePathname();
  const current =
    navItems.find((n) =>
      n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)
    ) ?? navItems[0];

  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", { hour12: false })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-hairline bg-base/80 px-5 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <current.icon className="h-4 w-4 text-accent" />
        <h1 className="text-sm font-medium text-ink">{current.label}</h1>
        <span className="mono hidden text-[11px] text-ink-faint sm:inline">
          · {cameraCount} cameras · {siteCount} sites
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="mono hidden items-center gap-1.5 text-[11px] text-ink-soft sm:flex">
          <Clock className="h-3 w-3" />
          {time}
        </span>
        <span className="mono flex items-center gap-1.5 rounded-md border border-safe/25 bg-safe/10 px-2 py-1 text-[10px] uppercase tracking-wide text-safe">
          <span className="h-1.5 w-1.5 rounded-full bg-safe" />
          Fleet healthy
        </span>
        <OnDeviceBadge />
      </div>
    </header>
  );
}
