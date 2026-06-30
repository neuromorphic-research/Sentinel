import { CloudOff, Cpu, ArrowRight, Lock } from "lucide-react";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { cn } from "@/lib/utils";

function EgressStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "safe" | "accent" | "ink";
}) {
  const toneText =
    tone === "safe"
      ? "text-safe"
      : tone === "accent"
        ? "text-accent"
        : "text-ink";
  return (
    <div className="flex items-center justify-between border-b border-hairline py-2 last:border-0">
      <span className="overline">{label}</span>
      <span className={cn("mono text-xs", toneText)}>{value}</span>
    </div>
  );
}

export function NoEgressPanel({ className }: { className?: string }) {
  return (
    <div className={cn("panel relative overflow-hidden p-5", className)}>
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-ink">
            No data egress
          </h3>
          <p className="mt-0.5 text-xs text-ink-soft">
            Footage is captured, analyzed and discarded on the unit. Only the
            verdict text leaves — never the video.
          </p>
        </div>
        <OnDeviceBadge />
      </div>

      <div className="relative grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* data-flow diagram */}
        <div className="panel-2 flex items-center justify-center p-4">
          <svg
            viewBox="0 0 460 170"
            role="img"
            aria-label="On-device processing diagram: footage never leaves the Axon unit"
            className="h-auto w-full"
          >
            {/* blocked cloud */}
            <g>
              <path
                d="M300 30 q-14 0 -16 14 q-16 1 -16 16 q0 15 16 15 h60 q16 0 16 -15 q0 -14 -16 -15 q-3 -15 -20 -15 q-12 0 -24 0 Z"
                fill="#15181E"
                stroke="#2E333D"
                strokeWidth="1.2"
                opacity="0.6"
              />
              <line x1="288" y1="34" x2="356" y2="68" stroke="#F2495C" strokeWidth="2" />
              <text
                x="324"
                y="95"
                textAnchor="middle"
                fontFamily="var(--font-mono), monospace"
                fontSize="9"
                letterSpacing="1.5"
                fill="#F2495C"
              >
                CLOUD · BLOCKED
              </text>
            </g>

            {/* dashed (severed) uplink */}
            <line
              x1="120"
              y1="70"
              x2="300"
              y2="58"
              stroke="#2E333D"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />

            {/* Axon edge node */}
            <g>
              <rect x="34" y="46" width="86" height="78" rx="10" fill="#101216" stroke="#155E75" strokeWidth="1.5" />
              <rect x="46" y="58" width="62" height="20" rx="4" fill="#06121A" stroke="#0E7490" strokeWidth="1" />
              <circle cx="58" cy="68" r="5" fill="none" stroke="#22D3EE" strokeWidth="1.2" />
              <text x="77" y="95" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="9" letterSpacing="1" fill="#A6ADBB">SPIKE</text>
              <text x="77" y="108" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="9" letterSpacing="1" fill="#A6ADBB">+ TALON</text>
              <text x="77" y="138" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="8" letterSpacing="1.5" fill="#6B7280">AXON X1</text>
            </g>

            {/* solid verdict-only link */}
            <line x1="120" y1="92" x2="338" y2="138" stroke="#155E75" strokeWidth="1.5" />
            <polygon points="338,138 330,132 332,141" fill="#22D3EE" />

            {/* verdict-only node */}
            <g>
              <rect x="338" y="120" width="96" height="36" rx="8" fill="#101216" stroke="#2E333D" strokeWidth="1.2" />
              <text x="386" y="136" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="8" letterSpacing="1" fill="#3BB273">VERDICT TEXT</text>
              <text x="386" y="148" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="7" letterSpacing="1" fill="#6B7280">~2 KB / event</text>
            </g>
          </svg>
        </div>

        {/* faux network counters */}
        <div className="panel-2 p-4">
          <div className="mb-2 flex items-center gap-1.5 overline">
            <Cpu className="h-3 w-3" />
            Network monitor
          </div>
          <EgressStat label="Cloud egress" value="0 MB" tone="safe" />
          <EgressStat label="Video uploaded" value="0 frames" tone="safe" />
          <EgressStat label="Inference" value="on-device" tone="accent" />
          <EgressStat label="Verdict payload" value="~2 KB" tone="ink" />
          <EgressStat label="At-rest encryption" value="AES-256" tone="ink" />

          <div className="mt-3 flex items-center gap-2 rounded-md border border-safe/20 bg-safe/5 px-3 py-2">
            <Lock className="h-4 w-4 shrink-0 text-safe" />
            <span className="text-[11px] text-ink-soft">
              Disconnect the uplink and Sentinel keeps working — fully offline.
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-faint">
        <span className="mono inline-flex items-center gap-1 text-ink-soft">
          <Cpu className="h-3 w-3 text-accent" /> Capture
        </span>
        <ArrowRight className="h-3 w-3" />
        <span className="mono text-ink-soft">Analyze</span>
        <ArrowRight className="h-3 w-3" />
        <span className="mono text-ink-soft">Decide</span>
        <ArrowRight className="h-3 w-3" />
        <span className="mono text-ink-soft">Discard frames</span>
        <ArrowRight className="h-3 w-3" />
        <span className="mono inline-flex items-center gap-1 text-safe">
          <CloudOff className="h-3 w-3" /> Verdict only
        </span>
      </div>
    </div>
  );
}
