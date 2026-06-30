"use client";

import { AnimatePresence } from "framer-motion";
import type { SentinelEvent } from "@/lib/types";
import { VerdictCard } from "./VerdictCard";
import { cn } from "@/lib/utils";

export function EventFeed({
  events,
  className,
  linkBase = "/events",
}: {
  events: SentinelEvent[];
  className?: string;
  linkBase?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <AnimatePresence initial={false}>
        {events.map((e) => (
          <VerdictCard key={e.id} event={e} href={`${linkBase}/${e.id}`} />
        ))}
      </AnimatePresence>
    </div>
  );
}
