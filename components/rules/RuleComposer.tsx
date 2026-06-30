"use client";

import { MapPin, Clock, ScanEye, ShieldOff, Zap, Sparkles } from "lucide-react";
import type { ActionKind } from "@/lib/types";
import { ChipGroup } from "./ChipGroup";
import {
  ZONE_OPTIONS,
  SCHEDULE_OPTIONS,
  OBJECT_OPTIONS,
  IGNORE_OPTIONS,
  ACTION_OPTIONS,
  type RuleDraft,
} from "./catalog";

export function RuleComposer({
  draft,
  onTextChange,
  onSetZone,
  onSetSchedule,
  onToggleObject,
  onToggleAction,
  onToggleIgnore,
}: {
  draft: RuleDraft;
  onTextChange: (text: string) => void;
  onSetZone: (zone: string) => void;
  onSetSchedule: (schedule: string) => void;
  onToggleObject: (value: string) => void;
  onToggleAction: (value: ActionKind) => void;
  onToggleIgnore: (value: string) => void;
}) {
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="overline">Compose · plain English</span>
      </div>

      {/* Natural-language entry — the Synapse-style prompt */}
      <div className="mt-3">
        <textarea
          value={draft.text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={3}
          spellCheck={false}
          placeholder="Describe what should raise an alert…"
          className="w-full resize-none rounded-lg border border-hairline-strong bg-base px-3.5 py-3 text-[15px] leading-relaxed text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
        />
        <p className="mt-2 font-mono text-[10px] text-ink-faint">
          Sentinel compiles your sentence into the perception graph below. Wire the
          nodes to refine it.
        </p>
      </div>

      {/* Wired nodes */}
      <div className="mt-5 space-y-5">
        <ChipGroup
          icon={MapPin}
          label="Zone"
          hint="where"
          options={ZONE_OPTIONS}
          selected={draft.zone ? [draft.zone] : []}
          onToggle={onSetZone}
        />
        <ChipGroup
          icon={Clock}
          label="Schedule"
          hint="when"
          options={SCHEDULE_OPTIONS}
          selected={draft.schedule ? [draft.schedule] : []}
          onToggle={onSetSchedule}
        />
        <ChipGroup
          icon={ScanEye}
          label="Objects"
          hint="watch for"
          options={OBJECT_OPTIONS}
          selected={draft.objects}
          onToggle={onToggleObject}
        />
        <ChipGroup
          icon={ShieldOff}
          label="Ignore"
          hint="suppress on-device"
          options={IGNORE_OPTIONS}
          selected={draft.ignore}
          onToggle={onToggleIgnore}
          tone="ignore"
        />
        <ChipGroup
          icon={Zap}
          label="Actions"
          hint="on verified hit"
          options={ACTION_OPTIONS}
          selected={draft.actions}
          onToggle={(v) => onToggleAction(v as ActionKind)}
          last
        />
      </div>
    </div>
  );
}
