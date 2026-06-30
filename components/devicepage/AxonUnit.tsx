import { cn } from "@/lib/utils";

/**
 * Stylized industrial illustration of the Axon X1 edge unit — a rugged IP65
 * bullet-style camera with on-board compute. Pure SVG/CSS, no raster assets.
 * The status LED uses `animate-flicker` to read as "live".
 */
export function AxonUnit({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 320"
      role="img"
      aria-label="Axon X1 edge compute camera unit"
      className={cn("h-auto w-full select-none", className)}
    >
      {/* faint structural grid behind the unit */}
      <defs>
        <linearGradient id="axon-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A1E26" />
          <stop offset="1" stopColor="#101216" />
        </linearGradient>
        <linearGradient id="axon-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#23272F" />
          <stop offset="1" stopColor="#15181E" />
        </linearGradient>
        <radialGradient id="axon-glass" cx="0.42" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#0E2A33" />
          <stop offset="0.55" stopColor="#06121A" />
          <stop offset="1" stopColor="#020608" />
        </radialGradient>
        <radialGradient id="axon-lens-glint" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#22D3EE" stopOpacity="0.55" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* baseline shadow */}
      <ellipse cx="230" cy="292" rx="150" ry="10" fill="#000000" opacity="0.45" />

      {/* wall plate + mount arm */}
      <g stroke="#2E333D" strokeWidth="1.5">
        <rect x="44" y="120" width="18" height="96" rx="3" fill="#15181E" />
        <circle cx="53" cy="138" r="2.2" fill="#0A0B0D" />
        <circle cx="53" cy="198" r="2.2" fill="#0A0B0D" />
        <path d="M62 168 L104 168 L104 178 L62 178 Z" fill="#1A1E26" />
        {/* articulating knuckle */}
        <circle cx="110" cy="173" r="12" fill="#1A1E26" />
        <circle cx="110" cy="173" r="4" fill="#0A0B0D" />
      </g>

      {/* sun visor / shield */}
      <path
        d="M120 118 Q230 96 372 110 L372 128 Q230 116 124 134 Z"
        fill="url(#axon-visor)"
        stroke="#2E333D"
        strokeWidth="1.5"
      />

      {/* main cylindrical housing */}
      <g stroke="#2E333D" strokeWidth="1.5">
        <rect
          x="118"
          y="128"
          width="250"
          height="96"
          rx="48"
          fill="url(#axon-body)"
        />
        {/* heat-sink fins / grooves */}
        <line x1="170" y1="140" x2="170" y2="212" stroke="#23272F" />
        <line x1="186" y1="138" x2="186" y2="214" stroke="#23272F" />
        <line x1="202" y1="137" x2="202" y2="215" stroke="#23272F" />
        <line x1="218" y1="136" x2="218" y2="216" stroke="#23272F" />
        <line x1="234" y1="136" x2="234" y2="216" stroke="#23272F" />
        {/* etched wordmark */}
        <text
          x="252"
          y="180"
          fontFamily="var(--font-mono), monospace"
          fontSize="13"
          letterSpacing="3"
          fill="#6B7280"
        >
          AXON X1
        </text>
        <text
          x="252"
          y="196"
          fontFamily="var(--font-mono), monospace"
          fontSize="8"
          letterSpacing="2"
          fill="#3a414d"
        >
          70 TOPS · IP65
        </text>
      </g>

      {/* front lens bezel */}
      <g>
        <circle cx="150" cy="176" r="56" fill="#15181E" stroke="#2E333D" strokeWidth="1.5" />
        <circle cx="150" cy="176" r="48" fill="#101216" stroke="#23272F" strokeWidth="1" />
        {/* knurled focus ring ticks */}
        <g stroke="#2E333D" strokeWidth="1.2">
          <line x1="150" y1="124" x2="150" y2="132" />
          <line x1="150" y1="220" x2="150" y2="228" />
          <line x1="98" y1="176" x2="106" y2="176" />
          <line x1="194" y1="176" x2="202" y2="176" />
        </g>
        {/* glass */}
        <circle cx="150" cy="176" r="38" fill="url(#axon-glass)" stroke="#0E7490" strokeWidth="1" />
        <circle cx="150" cy="176" r="22" fill="none" stroke="#155E75" strokeWidth="1" opacity="0.7" />
        {/* lens glint */}
        <circle cx="150" cy="176" r="30" fill="url(#axon-lens-glint)" />
        <circle cx="138" cy="164" r="6" fill="#22D3EE" opacity="0.25" />
      </g>

      {/* IR illuminator ring (small dots) */}
      <g fill="#7F1D24">
        <circle cx="150" cy="130" r="2.4" />
        <circle cx="118" cy="148" r="2.4" />
        <circle cx="118" cy="204" r="2.4" />
        <circle cx="150" cy="222" r="2.4" />
      </g>

      {/* status LED — live, flickers */}
      <g className="animate-flicker">
        <circle cx="340" cy="146" r="9" fill="#3BB273" opacity="0.18" />
        <circle cx="340" cy="146" r="4" fill="#3BB273" />
        <circle cx="340" cy="146" r="2" fill="#9af0c4" />
      </g>
      <text
        x="340"
        y="170"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="7"
        letterSpacing="1.5"
        fill="#6B7280"
      >
        PWR
      </text>

      {/* rear connector cluster — PoE port */}
      <g stroke="#2E333D" strokeWidth="1.5">
        <rect x="366" y="150" width="40" height="52" rx="6" fill="#15181E" />
        {/* RJ45 PoE jack */}
        <rect x="374" y="160" width="24" height="16" rx="2" fill="#0A0B0D" />
        <rect x="378" y="160" width="16" height="5" fill="#1A1E26" />
        {/* power/aux jack */}
        <circle cx="386" cy="188" r="6" fill="#0A0B0D" />
        <circle cx="386" cy="188" r="2.5" fill="#2E333D" />
      </g>
      <text
        x="386"
        y="216"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="7"
        letterSpacing="1.5"
        fill="#6B7280"
      >
        PoE+
      </text>
    </svg>
  );
}
