"use client";

import { motion } from "framer-motion";
import { CheckCircle2, EyeOff, ArrowRight } from "lucide-react";
import { StatusChip } from "@/components/ui/StatusChip";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { RulePill } from "@/components/ui/RulePill";
import { ACTION_LABELS } from "@/lib/status";
import { cn } from "@/lib/utils";
import {
  buildTriggerSentence,
  buildSuppressSentence,
  buildActionSentence,
  IGNORE_OPTIONS,
  OBJECT_OPTIONS,
  type RuleDraft,
} from "./catalog";

export function RulePreview({ draft }: { draft: RuleDraft }) {
  const trigger = buildTriggerSentence(draft);
  const suppress = buildSuppressSentence(draft);
  const action = buildActionSentence(draft);

  const primaryObject =
    OBJECT_OPTIONS.find((o) => o.value === draft.objects[0])?.label ?? "Person";
  const zone = draft.zone || "monitored area";
  const ignoreSample = IGNORE_OPTIONS.find((o) => o.value === draft.ignore[0]);

  return (
    <div className="panel flex flex-col p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="overline">Live preview</span>
        </div>
        <OnDeviceBadge size="sm" />
      </div>

      {/* Plain-English summary — re-animates as the draft changes */}
      <motion.div
        key={trigger + suppress + action}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="panel-2 mt-4 p-4"
      >
        <p className="text-[15px] leading-relaxed text-ink">{trigger}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{suppress}</p>
        <div className="mt-3 flex items-start gap-2 border-t border-hairline pt-3">
          <Zap />
          <p className="text-sm leading-relaxed text-ink-soft">{action}</p>
        </div>
      </motion.div>

      {/* Sample matches — illustrate one verified hit + one suppression */}
      <div className="mt-4">
        <span className="overline">Sample evaluations</span>
        <div className="mt-2 space-y-2.5">
          <SampleRow
            tone="verified"
            icon={<CheckCircle2 className="h-4 w-4 text-threat" />}
            title={`${primaryObject} in ${zone}`}
            body={`Movement consistent with deliberate entry ${
              draft.schedule && draft.schedule !== "All hours"
                ? `during ${draft.schedule}`
                : "after hours"
            }. Talon confirms intrusion.`}
            confidence={96}
            footer={
              draft.actions.length > 0
                ? draft.actions.map((a) => ACTION_LABELS[a]).join(" · ")
                : "Logged"
            }
          />
          <SampleRow
            tone="dismissed"
            icon={<EyeOff className="h-4 w-4 text-safe" />}
            title={`${ignoreSample?.label ?? "Wildlife"} crossing ${zone}`}
            body={`No human form / intent detected. Suppressed on-device — no alert raised.`}
            confidence={3}
            footer="Suppressed · 0 dispatched"
          />
        </div>
      </div>

      <p className="mt-4 font-mono text-[10px] leading-relaxed text-ink-faint">
        Preview is illustrative — Sentinel evaluates every frame on the Axon edge
        device. Footage never leaves the camera.
      </p>
    </div>
  );
}

function Zap() {
  return (
    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
  );
}

function SampleRow({
  tone,
  icon,
  title,
  body,
  confidence,
  footer,
}: {
  tone: "verified" | "dismissed";
  icon: React.ReactNode;
  title: string;
  body: string;
  confidence: number;
  footer: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-base/40 p-3",
        tone === "verified" ? "border-threat/20" : "border-safe/20"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-ink">{title}</span>
        </div>
        <StatusChip stage={tone === "verified" ? "verified" : "dismissed"} />
      </div>
      <p className="mt-1.5 pl-6 text-[13px] leading-relaxed text-ink-soft">{body}</p>
      <div className="mt-2 flex items-center justify-between gap-2 pl-6">
        <RulePill tone={tone === "verified" ? "accent" : "neutral"}>{footer}</RulePill>
        <span
          className={cn(
            "mono text-[11px]",
            tone === "verified" ? "text-threat" : "text-ink-faint"
          )}
        >
          conf {confidence}%
        </span>
      </div>
    </div>
  );
}
