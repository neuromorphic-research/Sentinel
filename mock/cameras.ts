import type { Camera, DeviceHealth } from "@/lib/types";

function device(partial: Partial<DeviceHealth> = {}): DeviceHealth {
  return {
    model: "Axon X1",
    tops: 70,
    tempC: 41,
    poe: true,
    storagePct: 38,
    latencyMs: 38,
    uptimeDays: 214,
    ...partial,
  };
}

export const cameras: Camera[] = [
  {
    id: "cam-ns-fence",
    name: "NS · East Fence Line",
    siteId: "site-north-sub",
    scene: "fence-night",
    stage: "verifying",
    device: device({ tempC: 39, latencyMs: 36, storagePct: 44, uptimeDays: 301 }),
  },
  {
    id: "cam-ns-cabinet",
    name: "NS · Control Cabinets",
    siteId: "site-north-sub",
    scene: "substation",
    stage: "idle",
    device: device({ tempC: 43, latencyMs: 41, storagePct: 51 }),
  },
  {
    id: "cam-rs-yard",
    name: "RS · Main Yard",
    siteId: "site-riverside",
    scene: "yard-night",
    stage: "candidate",
    device: device({ tempC: 45, latencyMs: 37, storagePct: 29, uptimeDays: 88 }),
  },
  {
    id: "cam-rs-gate",
    name: "RS · South Gate",
    siteId: "site-riverside",
    scene: "gate",
    stage: "idle",
    device: device({ tempC: 40, latencyMs: 35, storagePct: 33, uptimeDays: 88 }),
  },
  {
    id: "cam-dc-dock",
    name: "DC-2 · Dock 7",
    siteId: "site-dc2",
    scene: "loading-dock",
    stage: "dismissed",
    device: device({ tempC: 47, latencyMs: 40, storagePct: 62, uptimeDays: 410 }),
  },
  {
    id: "cam-dc-perimeter",
    name: "DC-2 · West Perimeter",
    siteId: "site-dc2",
    scene: "perimeter",
    stage: "idle",
    device: device({ tempC: 42, latencyMs: 38, storagePct: 58, uptimeDays: 410 }),
  },
  {
    id: "cam-eq-yard",
    name: "EQ-B · Equipment Yard",
    siteId: "site-equip-b",
    scene: "equipment-yard",
    stage: "verified",
    device: device({ tempC: 49, latencyMs: 44, storagePct: 71, uptimeDays: 156, poe: true }),
  },
  {
    id: "cam-dp-gate",
    name: "DP · Main Gate",
    siteId: "site-depot",
    scene: "gate",
    stage: "idle",
    device: device({ tempC: 38, latencyMs: 39, storagePct: 22, uptimeDays: 64 }),
  },
  {
    id: "cam-dp-perimeter",
    name: "DP · Rail Perimeter",
    siteId: "site-depot",
    scene: "perimeter",
    stage: "candidate",
    device: device({ tempC: 41, latencyMs: 37, storagePct: 26, uptimeDays: 64 }),
  },
];

export const cameraById = (id: string) => cameras.find((c) => c.id === id);
