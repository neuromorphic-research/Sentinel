"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ShieldHalf } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col border-r border-hairline bg-panel md:flex">
      <div className="flex items-center gap-2.5 border-b border-hairline px-5 py-4">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-md border border-accent/30 bg-accent/10">
          <ShieldHalf className="h-4.5 w-4.5 text-accent" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-flicker rounded-full bg-accent" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight text-ink">Sentinel</div>
          <div className="mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
            Edge Perimeter Guard
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-elevated text-ink"
                  : "text-ink-soft hover:bg-panel-2 hover:text-ink"
              )}
            >
              {active && (
                <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent" />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-accent" : "text-ink-faint group-hover:text-ink-soft"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hairline p-3">
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
          <div className="mono text-[9px] uppercase tracking-[0.16em] text-accent">
            Neuromorphic Edge Stack
          </div>
          <p className="mt-1 text-[11px] leading-snug text-ink-soft">
            Spike · Talon · Synapse · Axon
          </p>
        </div>
      </div>
    </aside>
  );
}
