"use client";

import type { Camera } from "@/lib/types";
import { CameraTile } from "./CameraTile";
import { cn } from "@/lib/utils";

export function CameraGrid({
  cameras,
  className,
  cols = "lg:grid-cols-3",
  linkBase = "/camera",
}: {
  cameras: Camera[];
  className?: string;
  cols?: string;
  linkBase?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", cols, className)}>
      {cameras.map((cam) => (
        <CameraTile key={cam.id} camera={cam} href={`${linkBase}/${cam.id}`} />
      ))}
    </div>
  );
}
