import type { Camera } from "@/lib/types";
import { cn } from "@/lib/utils";

type SceneKey = Camera["scene"];

// Dummy night-CCTV stills served from /public/scenes. The SVG renderer below is
// kept as a graceful fallback if an image is ever missing.
const SCENE_IMAGE: Record<SceneKey, string> = {
  "fence-night": "/scenes/scene-fence-night.png",
  "yard-night": "/scenes/scene-yard-night.png",
  "loading-dock": "/scenes/scene-loading-dock.png",
  substation: "/scenes/scene-substation.png",
  gate: "/scenes/scene-gate.png",
  "equipment-yard": "/scenes/scene-equipment-yard.png",
  perimeter: "/scenes/scene-perimeter.png",
};

/**
 * A night/IR camera still. Renders a photographic placeholder frame with the
 * detection-overlay language (scanlines, vignette, IR tint) layered on top.
 * Falls back to a fully SVG-drawn scene if no image is mapped.
 */
export function SceneFrame({
  scene,
  className,
  children,
}: {
  scene: SceneKey;
  className?: string;
  children?: React.ReactNode;
}) {
  const img = SCENE_IMAGE[scene];

  return (
    <div className={cn("relative overflow-hidden frame-bg", className)}>
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full select-none object-cover"
          draggable={false}
        />
      ) : (
        <svg
          viewBox="0 0 320 180"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0e141b" />
              <stop offset="1" stopColor="#080a0d" />
            </linearGradient>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0c0f13" />
              <stop offset="1" stopColor="#05060800" />
            </linearGradient>
            <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="rgba(245,165,36,0.45)" />
              <stop offset="1" stopColor="rgba(245,165,36,0)" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="320" height="180" fill="url(#sky)" />
          <SceneArt scene={scene} />
          <rect x="0" y="96" width="320" height="84" fill="url(#ground)" />
        </svg>
      )}

      {/* IR tint + scanlines + vignette so it reads as a live security feed */}
      <div className="pointer-events-none absolute inset-0 bg-[#0a1410] mix-blend-color opacity-30" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-50" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.7)]" />

      {children}
    </div>
  );
}

function SceneArt({ scene }: { scene: SceneKey }) {
  const stroke = "#1c2530";
  const line = "#222d39";
  switch (scene) {
    case "fence-night":
      return (
        <g stroke={line} strokeWidth="1">
          <line x1="0" y1="118" x2="320" y2="104" stroke={stroke} />
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={i} x1={i * 15} y1={60} x2={i * 15} y2={130} opacity="0.5" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={64 + i * 11} x2="320" y2={56 + i * 11} opacity="0.35" />
          ))}
          <ellipse cx="40" cy="40" rx="60" ry="40" fill="url(#lamp)" />
        </g>
      );
    case "yard-night":
      return (
        <g stroke={line} strokeWidth="1">
          <rect x="30" y="92" width="70" height="34" fill="#0d1218" opacity="0.8" />
          <rect x="120" y="80" width="48" height="46" fill="#0d1218" opacity="0.8" />
          <rect x="210" y="96" width="90" height="30" fill="#0d1218" opacity="0.8" />
          <line x1="0" y1="128" x2="320" y2="120" stroke={stroke} />
          <ellipse cx="270" cy="36" rx="70" ry="44" fill="url(#lamp)" />
        </g>
      );
    case "loading-dock":
      return (
        <g stroke={line} strokeWidth="1">
          <rect x="20" y="56" width="280" height="70" fill="#0c1116" opacity="0.9" />
          {Array.from({ length: 5 }).map((_, i) => (
            <rect key={i} x={34 + i * 56} y={70} width="40" height="56" fill="#070a0d" stroke={stroke} />
          ))}
          <line x1="0" y1="130" x2="320" y2="130" stroke={stroke} strokeDasharray="6 6" />
          <ellipse cx="160" cy="40" rx="120" ry="34" fill="url(#lamp)" />
        </g>
      );
    case "substation":
      return (
        <g stroke={line} strokeWidth="1">
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i}>
              <rect x={26 + i * 48} y={74} width="30" height="52" fill="#0c1116" stroke={stroke} />
              <line x1={41 + i * 48} y1={56} x2={41 + i * 48} y2={74} />
            </g>
          ))}
          <line x1="0" y1="126" x2="320" y2="122" stroke={stroke} />
          <ellipse cx="80" cy="34" rx="80" ry="30" fill="url(#lamp)" />
        </g>
      );
    case "gate":
      return (
        <g stroke={line} strokeWidth="1">
          <rect x="60" y="58" width="200" height="68" fill="none" stroke={stroke} />
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1={70 + i * 20} y1={60} x2={70 + i * 20} y2={124} opacity="0.5" />
          ))}
          <line x1="60" y1="58" x2="60" y2="130" strokeWidth="2" />
          <line x1="260" y1="58" x2="260" y2="130" strokeWidth="2" />
          <line x1="0" y1="130" x2="320" y2="126" stroke={stroke} />
          <ellipse cx="160" cy="44" rx="80" ry="30" fill="url(#lamp)" />
        </g>
      );
    case "equipment-yard":
      return (
        <g stroke={line} strokeWidth="1">
          <rect x="30" y="84" width="60" height="42" fill="#0d1218" />
          <rect x="100" y="70" width="40" height="56" fill="#0c1116" />
          <path d="M150 110 l30 -26 18 12 v30 h-48 z" fill="#0d1218" />
          <rect x="220" y="92" width="74" height="34" fill="#0d1218" />
          <line x1="0" y1="128" x2="320" y2="122" stroke={stroke} />
          <ellipse cx="200" cy="34" rx="90" ry="34" fill="url(#lamp)" />
        </g>
      );
    case "perimeter":
    default:
      return (
        <g stroke={line} strokeWidth="1">
          <line x1="0" y1="112" x2="320" y2="92" stroke={stroke} strokeWidth="2" />
          <line x1="0" y1="120" x2="320" y2="100" stroke={stroke} strokeDasharray="4 6" />
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={i * 24} y1={86} x2={i * 24} y2={120} opacity="0.4" />
          ))}
          <ellipse cx="290" cy="34" rx="70" ry="30" fill="url(#lamp)" />
        </g>
      );
  }
}
