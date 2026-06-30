"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, XOctagon, BookMarked, Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type OverrideId = "escalate" | "dismiss" | "bolo";

interface OverrideDef {
  id: OverrideId;
  label: string;
  done: string;
  icon: LucideIcon;
  tone: "threat" | "safe" | "accent";
}

const OVERRIDES: OverrideDef[] = [
  { id: "escalate", label: "Escalate to police", done: "Escalated", icon: ShieldAlert, tone: "threat" },
  { id: "dismiss", label: "Dismiss event", done: "Dismissed", icon: XOctagon, tone: "safe" },
  { id: "bolo", label: "Add to BOLO", done: "Added to BOLO", icon: BookMarked, tone: "accent" },
];

const TONE: Record<OverrideDef["tone"], { idle: string; active: string }> = {
  threat: {
    idle: "border-hairline-strong text-ink-soft hover:border-threat/40 hover:text-threat",
    active: "border-threat/40 bg-threat/10 text-threat",
  },
  safe: {
    idle: "border-hairline-strong text-ink-soft hover:border-safe/40 hover:text-safe",
    active: "border-safe/40 bg-safe/10 text-safe",
  },
  accent: {
    idle: "border-hairline-strong text-ink-soft hover:border-accent/40 hover:text-accent",
    active: "border-accent/40 bg-accent/10 text-accent",
  },
};

/**
 * Manual operator overrides. Visual only — selecting one flips a local
 * confirmation state so the demo feels responsive without any backend.
 */
export function OverrideActions({ className }: { className?: string }) {
  const [active, setActive] = useState<OverrideId | null>(null);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <span className="overline">Operator override</span>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {OVERRIDES.map((o) => {
          const isActive = active === o.id;
          const Icon = isActive ? Check : o.icon;
          const tone = TONE[o.tone];
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setActive(isActive ? null : o.id)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors",
                isActive ? tone.active : tone.idle
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {isActive ? o.done : o.label}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {active && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mono text-[11px] text-ink-faint"
          >
            Override logged locally · operator action queued (demo)
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
