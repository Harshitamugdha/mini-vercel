
interface TraceArrowProps {
  x:     number;
  y:     number;
  angle: number;
  visible?: boolean;
}

export default function TraceArrow({ x, y, angle, visible = true }: TraceArrowProps) {
  if (!visible) return null;

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${angle})`}
      className="trace-arrow"
    >
      <circle
        r={6}
        fill="#38bdf8"
        opacity={0.18}
        filter="url(#arrow-bloom)"
      />
      <circle
        r={2.5}
        fill="#7dd3fc"
        opacity={0.55}
        filter="url(#arrow-bloom)"
      />

      <path
        d="M -10 -5 L 12 0 L -10 5 L -4 0 Z"
        fill="#38bdf8"
        stroke="#bae6fd"
        strokeWidth={0.6}
        filter="url(#arrow-glow)"
      />

      <path
        d="M 8 -1.5 L 12 0 L 8 1.5"
        fill="#e0f2fe"
        opacity={0.9}
      />
    </g>
  );
}

export function TraceArrowDefs() {
  return (
    <defs>
      <filter id="arrow-glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="1.8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="arrow-bloom" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="trace-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  );
}
