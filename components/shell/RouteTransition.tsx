"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Subtle fade/slide on route change so navigation feels premium and intentional.
 * Pure CSS (keyed re-mount) — no layout thrash, no dependency on page internals.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [stage, setStage] = useState<"in" | "out">("in");
  const prev = useRef(pathname);

  useEffect(() => {
    if (prev.current !== pathname) {
      prev.current = pathname;
      setStage("in");
    }
  }, [pathname]);

  return (
    <div
      key={pathname}
      data-stage={stage}
      className="motion-safe:animate-fade-in"
    >
      {children}
    </div>
  );
}
