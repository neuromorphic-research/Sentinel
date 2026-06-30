"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { SentinelEvent } from "@/lib/types";
import { siteById } from "@/mock/sites";
import { ACTION_LABELS, DISMISSAL_LABELS } from "@/lib/status";
import { SceneFrame } from "@/components/scene/SceneFrame";
import { DetectionOverlay } from "@/components/scene/DetectionOverlay";
import { StatusChip } from "@/components/ui/StatusChip";
import { cameraById } from "@/mock/cameras";
import { cn } from "@/lib/utils";

export function VerdictCard({
  event,
  href,
  className,
}: {
  event: SentinelEvent;
  href?: string;
  className?: string;
}) {
  const site = siteById(event.siteId);
  const cam = cameraById(event.cameraId);
  const verified = event.stage === "verified";

  const body = (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "group panel overflow-hidden transition-colors hover:border-hairline-strong",
        verified ? "hover:border-threat/40" : "hover:border-safe/30",
        className
      )}
    >
      <div className="flex gap-3 p-3">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-hairline">
          {cam && <SceneFrame scene={cam.scene} className="h-full w-full" />}
          <DetectionOverlay
            stage={event.stage}
            scan={false}
            boxes={[{ x: 38, y: 28, w: 22, h: 52 }]}
          />
          <span
            className={cn(
              "absolute left-1 top-1 h-1.5 w-1.5 rounded-full",
              verified ? "bg-threat" : "bg-safe"
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-medium text-ink">
              {site?.name}
            </span>
            <StatusChip stage={event.stage} />
          </div>

          <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-ink-soft">
            {event.verdict}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="mono inline-flex items-center gap-1 text-[11px] text-ink-faint">
              <Clock className="h-3 w-3" />
              {event.timestamp}
            </span>
            <span
              className={cn(
                "mono text-[11px]",
                verified ? "text-threat" : "text-safe"
              )}
            >
              {event.confidence}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t border-hairline bg-panel-2 px-3 py-1.5">
        {verified
          ? event.actions
              .filter((a) => a.kind !== "log-only")
              .map((a) => (
                <span
                  key={a.kind}
                  className="mono rounded border border-threat/25 bg-threat/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-threat"
                >
                  {ACTION_LABELS[a.kind]}
                </span>
              ))
          : (
            <span className="mono rounded border border-safe/25 bg-safe/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-safe">
              Suppressed · {event.dismissalReason ? DISMISSAL_LABELS[event.dismissalReason] : "Non-event"}
            </span>
          )}
      </div>
    </motion.article>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none">
        {body}
      </Link>
    );
  }
  return body;
}
