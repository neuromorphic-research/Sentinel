import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/shell/Page";

export default function NotFound() {
  return (
    <PageContainer>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-hairline-strong bg-panel">
          <ShieldAlert className="h-7 w-7 text-pending" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-flicker rounded-full bg-pending" />
        </div>
        <div className="overline mb-2">Signal lost · 404</div>
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          No feed at this route
        </h2>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          This view isn&apos;t part of the perimeter. Return to Live Operations to
          resume monitoring.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/15"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Live Operations
        </Link>
      </div>
    </PageContainer>
  );
}
