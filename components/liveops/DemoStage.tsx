"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Brain, Megaphone, Radio, ShieldCheck } from "lucide-react";
import type { Camera, DismissalReason } from "@/lib/types";
import { DISMISSAL_LABELS } from "@/lib/status";
import { SceneFrame } from "@/components/scene/SceneFrame";
import { DetectionOverlay } from "@/components/scene/DetectionOverlay";
import { StatusChip } from "@/components/ui/StatusChip";
import { ConfidenceMeter } from "@/components/ui/ConfidenceMeter";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { CascadeTrace } from "@/components/cascade/CascadeTrace";
import { fleetStat } from "@/mock";
import { cn, formatNumber } from "@/lib/utils";

// ── Lifecycle phases the featured tile cycles through ────────────────────────
type Phase = "idle" | "spike" | "talon" | "verdict" | "action" | "logged";

const PHASES: Phase[] = ["idle", "spike", "talon", "verdict", "action", "logged"];

const DURATION: Record<Phase, number> = {
  idle: 1500,
  spike: 1700,
  talon: 2100,
  verdict: 2800,
  action: 2000,
  logged: 1500,
};

interface DetectionBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
}

interface Scenario {
  cameraId: string;
  cameraName: string;
  siteName: string;
  scene: Camera["scene"];
  outcome: "verified" | "dismissed";
  spikeMs: number;
  talonMs: number;
  confidence: number;
  candidateLabel: string;
  verdict: string;
  matchedRule?: string;
  dismissalReason?: DismissalReason;
  actionLabel: string;
  actionChips: string[];
  box: DetectionBox;
}

// Two emotional beats, alternating: a real intrusion and a suppressed non-event.
const SCENARIOS: Scenario[] = [
  {
    cameraId: "cam-ns-fence",
    cameraName: "East Fence Line",
    siteName: "North Substation",
    scene: "fence-night",
    outcome: "verified",
    spikeMs: 36,
    talonMs: 1180,
    confidence: 96,
    candidateLabel: "Human?",
    verdict:
      "Single person climbing perimeter fence, east line. Movement consistent with deliberate entry. No authorized badge detected.",
    matchedRule: "After-hours intrusion — restricted zone",
    actionLabel: "Talk-down + SOC",
    actionChips: ["Talk-down", "Notify SOC", "Flood lights"],
    box: { x: 43, y: 28, w: 15, h: 48, label: "INTRUDER" },
  },
  {
    cameraId: "cam-dc-dock",
    cameraName: "Dock 7",
    siteName: "DC-2 Loading Dock",
    scene: "loading-dock",
    outcome: "dismissed",
    spikeMs: 40,
    talonMs: 720,
    confidence: 93,
    candidateLabel: "Motion",
    verdict:
      "Motion dismissed: animal (likely fox) crossing dock apron. No human form detected. Suppressed on-device — no alert raised.",
    dismissalReason: "wildlife",
    actionLabel: "Logged · no alert",
    actionChips: ["Suppressed", "Wildlife"],
    box: { x: 48, y: 64, w: 13, h: 16, label: "Animal" },
  },
];

function phaseStage(phase: Phase, outcome: Scenario["outcome"]) {
  switch (phase) {
    case "spike":
      return "candidate" as const;
    case "talon":
      return "verifying" as const;
    case "verdict":
    case "action":
    case "logged":
      return outcome;
    default:
      return "idle" as const;
  }
}

export function DemoStage({ className }: { className?: string }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [suppressed, setSuppressed] = useState(fleetStat.falseAlarmsSuppressed);
  const countedFor = useRef(-1);

  const phase = PHASES[phaseIdx];
  const scenario = SCENARIOS[scenarioIdx % SCENARIOS.length];

  // Drive the lifecycle with chained timeouts; reset + advance scenario at the end.
  useEffect(() => {
    const t = setTimeout(() => {
      setPhaseIdx((i) => {
        if (i === PHASES.length - 1) {
          setScenarioIdx((s) => s + 1);
          return 0;
        }
        return i + 1;
      });
    }, DURATION[phase]);
    return () => clearTimeout(t);
  }, [phaseIdx, phase]);

  // Tick the suppressed counter exactly once when a false alarm is dismissed.
  useEffect(() => {
    if (
      phase === "verdict" &&
      scenario.outcome === "dismissed" &&
      countedFor.current !== scenarioIdx
    ) {
      countedFor.current = scenarioIdx;
      setSuppressed((c) => c + 1);
    }
  }, [phase, scenario.outcome, scenarioIdx]);

  const stage = phaseStage(phase, scenario.outcome);
  const showCascade = phase === "talon" || phase === "verdict" || phase === "action" || phase === "logged";
  const showVerdict = phase === "verdict" || phase === "action" || phase === "logged";
  const showActions = phase === "action" || phase === "logged";
  const verified = scenario.outcome === "verified";

  const activeStep = phase === "spike" ? 0 : phase === "talon" ? 1 : showVerdict ? 2 : -1;

  return (
    <section className={cn("panel overflow-hidden", className)}>
      {/* header strip */}
      <div className="flex items-center justify-between gap-3 border-b border-hairline bg-panel-2 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="overline text-accent">Demo mode · live lifecycle</span>
        </div>
        <PipelineStepper active={activeStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* ── Scene ──────────────────────────────────────────────── */}
        <div className="relative lg:col-span-3">
          <div className="relative aspect-video w-full">
            <SceneFrame scene={scenario.scene} className="h-full w-full" />

            {stage !== "idle" && (
              <DetectionOverlay
                stage={stage}
                scan={phase === "spike" || phase === "talon"}
                boxes={[
                  {
                    ...scenario.box,
                    label: phase === "spike" ? scenario.candidateLabel : scenario.box.label,
                  },
                ]}
              />
            )}

            {/* top row */}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
              <span className="mono rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-ink backdrop-blur-sm">
                {scenario.cameraId.toUpperCase()}
              </span>
              <span className="mono flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-threat backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-threat" />
                REC
              </span>
            </div>

            {/* bottom row */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-ink drop-shadow">
                  {scenario.cameraName}
                </div>
                <div className="mono truncate text-[10px] text-ink-soft drop-shadow">
                  {scenario.siteName}
                </div>
              </div>
              <StatusChip stage={stage} />
            </div>
          </div>
        </div>

        {/* ── Readout ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 border-t border-hairline p-4 lg:col-span-2 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between gap-2">
            <span className="overline">Talon verdict</span>
            <OnDeviceBadge size="sm" />
          </div>

          {/* status line / verdict text */}
          <div className="min-h-[112px]">
            <AnimatePresence mode="wait">
              {!showVerdict ? (
                <motion.div
                  key={phase === "idle" ? "idle" : phase === "spike" ? "spike" : "talon"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {phase === "idle" && (
                    <p className="text-sm text-ink-faint">
                      <span className="mono">Monitoring</span> — awaiting motion on perimeter.
                    </p>
                  )}
                  {phase === "spike" && (
                    <p className="text-sm text-accent">
                      <span className="font-medium">Spike trigger.</span> Motion candidate
                      detected — tracking object.
                    </p>
                  )}
                  {phase === "talon" && (
                    <p className="text-sm text-pending">
                      <span className="font-medium">Talon analyzing</span>
                      <AnimatedDots /> — reasoning over the scene on-device.
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key={`verdict-${scenarioIdx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-[13px] leading-snug text-ink">{scenario.verdict}</p>
                  {verified ? (
                    scenario.matchedRule && (
                      <p className="mono mt-2 text-[11px] text-ink-faint">
                        Matched rule · {scenario.matchedRule}
                      </p>
                    )
                  ) : (
                    <p className="mono mt-2 inline-flex items-center gap-1 text-[11px] text-safe">
                      <ShieldCheck className="h-3 w-3" />
                      Suppressed on-device ·{" "}
                      {scenario.dismissalReason
                        ? DISMISSAL_LABELS[scenario.dismissalReason]
                        : "Non-event"}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* confidence */}
          <ConfidenceMeter
            value={showVerdict ? scenario.confidence : 0}
            tone={verified ? "threat" : "safe"}
          />

          {/* cascade */}
          <div className="min-h-[58px]">
            <AnimatePresence>
              {showCascade && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CascadeTrace
                    spikeMs={scenario.spikeMs}
                    talonMs={scenario.talonMs}
                    actionLabel={scenario.actionLabel}
                    compact
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* action chips */}
          <div className="min-h-[24px]">
            <AnimatePresence>
              {showActions && (
                <motion.div
                  className="flex flex-wrap items-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {scenario.actionChips.map((chip, i) => (
                    <motion.span
                      key={chip}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.12, duration: 0.25 }}
                      className={cn(
                        "mono rounded border px-1.5 py-0.5 text-[9px] uppercase tracking-wide",
                        verified
                          ? "border-threat/25 bg-threat/10 text-threat"
                          : "border-safe/25 bg-safe/10 text-safe"
                      )}
                    >
                      {chip}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* suppressed counter */}
          <SuppressedCounter
            value={suppressed}
            flash={!verified && showVerdict}
          />
        </div>
      </div>
    </section>
  );
}

// ── Spike → Talon → Action stepper in the header ─────────────────────────────
function PipelineStepper({ active }: { active: number }) {
  const steps = [
    { icon: Activity, label: "Spike", tone: "text-accent" },
    { icon: Brain, label: "Talon", tone: "text-pending" },
    { icon: Megaphone, label: "Action", tone: "text-threat" },
  ];
  return (
    <div className="flex items-center gap-1.5">
      {steps.map((s, i) => {
        const on = i <= active;
        return (
          <div key={s.label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "mono inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] transition-colors",
                on
                  ? cn("border-hairline-strong bg-elevated", s.tone)
                  : "border-hairline bg-panel-2 text-ink-faint"
              )}
            >
              <s.icon className="h-3 w-3" />
              <span className="hidden sm:inline">{s.label}</span>
            </span>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "h-px w-3 transition-colors",
                  i < active ? "bg-hairline-strong" : "bg-hairline"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AnimatedDots() {
  return (
    <span className="mono">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

function SuppressedCounter({ value, flash }: { value: number; flash: boolean }) {
  return (
    <div
      className={cn(
        "mt-auto flex items-center justify-between rounded-lg border px-3 py-2 transition-colors",
        flash ? "border-safe/40 bg-safe/10" : "border-hairline bg-panel-2"
      )}
    >
      <div className="flex items-center gap-2">
        <Radio className={cn("h-4 w-4", flash ? "text-safe" : "text-ink-faint")} />
        <span className="overline">False alarms suppressed · on-device</span>
      </div>
      <div className="relative h-6 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 14, opacity: 0, scale: 1.25 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className={cn(
              "mono block text-right text-base font-medium tabular-nums",
              flash ? "text-safe" : "text-ink"
            )}
          >
            {formatNumber(value)}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
