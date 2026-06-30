export { sites, siteById } from "./sites";
export { cameras, cameraById } from "./cameras";
export {
  events,
  eventById,
  verifiedEvents,
  dismissedEvents,
} from "./events";
export { rules, ruleById } from "./rules";
export {
  roiSeries,
  fleetStat,
  roiHeadline,
  dismissalBreakdown,
} from "./roi";

import { events } from "./events";
import { cameras } from "./cameras";
import { sites } from "./sites";

/** Events for a given camera, newest first. */
export const eventsForCamera = (cameraId: string) =>
  events.filter((e) => e.cameraId === cameraId).sort((a, b) => b.order - a.order);

/** Events for a given site, newest first. */
export const eventsForSite = (siteId: string) =>
  events.filter((e) => e.siteId === siteId).sort((a, b) => b.order - a.order);

/** Cameras belonging to a site. */
export const camerasForSite = (siteId: string) =>
  cameras.filter((c) => c.siteId === siteId);

export const siteCount = sites.length;
export const cameraCount = cameras.length;
