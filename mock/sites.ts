import type { Site } from "@/lib/types";

export const sites: Site[] = [
  {
    id: "site-north-sub",
    name: "North Substation",
    region: "Grid · Sector 4",
    x: 0.22,
    y: 0.28,
    connectivity: "cloud-na",
    cameraIds: ["cam-ns-fence", "cam-ns-cabinet"],
    notes: "Remote · cellular backhaul intermittent · runs fully on-device",
  },
  {
    id: "site-riverside",
    name: "Riverside Construction",
    region: "Metro West",
    x: 0.44,
    y: 0.55,
    connectivity: "edge-online",
    cameraIds: ["cam-rs-yard", "cam-rs-gate"],
    notes: "Active build site · high equipment value",
  },
  {
    id: "site-dc2",
    name: "DC-2 Loading Dock",
    region: "Logistics Park",
    x: 0.68,
    y: 0.36,
    connectivity: "edge-online",
    cameraIds: ["cam-dc-dock", "cam-dc-perimeter"],
    notes: "24/7 operations · authorized staff traffic",
  },
  {
    id: "site-equip-b",
    name: "Equipment Yard B",
    region: "Industrial South",
    x: 0.58,
    y: 0.74,
    connectivity: "cloud-na",
    cameraIds: ["cam-eq-yard"],
    notes: "Disconnected site · satellite uplink down 3d",
  },
  {
    id: "site-depot",
    name: "Westline Depot",
    region: "Rail Corridor",
    x: 0.82,
    y: 0.62,
    connectivity: "degraded",
    cameraIds: ["cam-dp-gate", "cam-dp-perimeter"],
    notes: "Low-bandwidth link · edge-only verification",
  },
];

export const siteById = (id: string) => sites.find((s) => s.id === id);
