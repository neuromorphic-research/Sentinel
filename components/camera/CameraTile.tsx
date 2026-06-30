"use client";

import Link from "next/link";
import type { Camera } from "@/lib/types";
import { siteById } from "@/mock/sites";
import { SceneFrame } from "@/components/scene/SceneFrame";
import { DetectionOverlay } from "@/components/scene/DetectionOverlay";
import { StatusChip } from "@/components/ui/StatusChip";
import { formatMs, cn } from "@/lib/utils";

export function CameraTile({
  camera,
  href,
  active,
  className,
}: {
  camera: Camera;
  href?: string;
  active?: boolean;
  className?: string;
}) {
  const site = siteById(camera.siteId);
  const showOverlay =
    camera.stage === "candidate" ||
    camera.stage === "verifying" ||
    camera.stage === "verified";

  const inner = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-panel transition-all",
        active ? "border-accent/50 shadow-glow" : "border-hairline hover:border-hairline-strong",
        className
      )}
    >
      <div className="relative aspect-video w-full">
        <SceneFrame scene={camera.scene} className="h-full w-full" />
        {showOverlay && <DetectionOverlay stage={camera.stage} />}

        {/* top overlay row */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
          <span className="mono rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-ink backdrop-blur-sm">
            {camera.id.toUpperCase()}
          </span>
          <span className="mono flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-threat backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-threat" />
            REC
          </span>
        </div>

        {/* bottom overlay row */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-2">
          <div className="min-w-0">
            <div className="truncate text-xs font-medium text-ink drop-shadow">
              {camera.name}
            </div>
            <div className="mono text-[10px] text-ink-soft drop-shadow">
              {site?.name} · {formatMs(camera.device.latencyMs)}
            </div>
          </div>
          <StatusChip stage={camera.stage} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none">
        {inner}
      </Link>
    );
  }
  return inner;
}
