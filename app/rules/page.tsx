"use client";

import { useState } from "react";
import { Plus, Workflow } from "lucide-react";
import type { ActionKind } from "@/lib/types";
import { rules } from "@/mock";
import { PageContainer, PageHeader } from "@/components/shell/Page";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { RuleComposer } from "@/components/rules/RuleComposer";
import { RulePreview } from "@/components/rules/RulePreview";
import { RuleCard } from "@/components/rules/RuleCard";
import type { RuleDraft } from "@/components/rules/catalog";

const INITIAL_DRAFT: RuleDraft = {
  text: "Alert on a person in the yard after 19:00; ignore animals and weather.",
  zone: "Restricted yard",
  schedule: "19:00 – 06:00",
  objects: ["person"],
  ignore: ["animal", "weather"],
  actions: ["talk-down", "notify-soc"],
};

function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function RuleBuilderPage() {
  const [draft, setDraft] = useState<RuleDraft>(INITIAL_DRAFT);
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(rules.map((r) => [r.id, r.enabled]))
  );

  const update = (patch: Partial<RuleDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));

  return (
    <PageContainer>
      <PageHeader
        title="Rule Builder"
        subtitle="Write perimeter logic in plain English. Sentinel compiles it into an on-device perception rule — no code, no cloud."
        actions={<OnDeviceBadge />}
      />

      {/* Composer (left) + live preview (right) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RuleComposer
          draft={draft}
          onTextChange={(text) => update({ text })}
          onSetZone={(zone) => update({ zone: draft.zone === zone ? "" : zone })}
          onSetSchedule={(schedule) =>
            update({ schedule: draft.schedule === schedule ? "" : schedule })
          }
          onToggleObject={(value) => update({ objects: toggleIn(draft.objects, value) })}
          onToggleAction={(value: ActionKind) =>
            update({ actions: toggleIn(draft.actions, value) })
          }
          onToggleIgnore={(value) => update({ ignore: toggleIn(draft.ignore, value) })}
        />
        <RulePreview draft={draft} />
      </div>

      {/* Existing rules */}
      <div className="mt-9">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-ink-faint" />
            <h3 className="text-sm font-semibold tracking-tight text-ink">
              Active rules
            </h3>
            <span className="mono text-[11px] text-ink-faint">
              {rules.length} wired
            </span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent transition-colors hover:bg-accent/20"
          >
            <Plus className="h-3.5 w-3.5" />
            New rule
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              enabled={enabledMap[rule.id]}
              onToggle={() =>
                setEnabledMap((m) => ({ ...m, [rule.id]: !m[rule.id] }))
              }
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
