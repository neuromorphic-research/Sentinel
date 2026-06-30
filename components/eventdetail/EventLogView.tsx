"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { SentinelEvent } from "@/lib/types";
import { VerdictCard } from "@/components/feed/VerdictCard";
import { cn } from "@/lib/utils";

type Filter = "all" | "verified" | "dismissed";

const TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "verified", label: "Verified" },
  { id: "dismissed", label: "Dismissed" },
];

/**
 * Client wrapper for the Event Log: filter tabs over a sorted EventFeed.
 * Events arrive pre-sorted (newest first) from the page.
 */
export function EventLogView({ events }: { events: SentinelEvent[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      all: events.length,
      verified: events.filter((e) => e.stage === "verified").length,
      dismissed: events.filter((e) => e.stage === "dismissed").length,
    }),
    [events]
  );

  const visible = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.stage === filter)),
    [events, filter]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1 rounded-lg border border-hairline bg-panel-2 p-1">
        {TABS.map((t) => {
          const isActive = filter === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-elevated text-ink"
                  : "text-ink-faint hover:text-ink-soft"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "mono rounded px-1 py-0.5 text-[10px]",
                  isActive ? "bg-base text-ink-soft" : "text-ink-faint"
                )}
              >
                {counts[t.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence initial={false}>
          {visible.map((e) => (
            <VerdictCard key={e.id} event={e} href={`/events/${e.id}`} />
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 && (
        <p className="mono py-12 text-center text-sm text-ink-faint">
          No events match this filter.
        </p>
      )}
    </div>
  );
}
