import type { LucideIcon } from "lucide-react";
import {
  Radar,
  ScanEye,
  Camera,
  Workflow,
  Map,
  BarChart3,
  Cpu,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Live Operations", short: "Live", icon: Radar },
  { href: "/events", label: "Event Detail", short: "Events", icon: ScanEye },
  { href: "/camera", label: "Single Camera", short: "Camera", icon: Camera },
  { href: "/rules", label: "Rule Builder", short: "Rules", icon: Workflow },
  { href: "/map", label: "Site / Fleet Map", short: "Map", icon: Map },
  { href: "/analytics", label: "Analytics / ROI", short: "Analytics", icon: BarChart3 },
  { href: "/device", label: "Device / Edge", short: "Device", icon: Cpu },
];
