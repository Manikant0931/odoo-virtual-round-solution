const RING_COLORS = { environmental: "#5C8A6C", social: "#D06B58", governance: "#5A6FC0" };

function Arc({ cx, cy, r, pct, color, width }) {
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;
  return (
    <g transform={`rotate(-90 ${cx} ${cy})`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeOpacity="0.14" strokeWidth={width} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </g>
  );
}

export default function ScoreRing({ environmental, social, governance, overall, size = 168, label = "Overall ESG Score" }) {
  const cx = size / 2;
  const cy = size / 2;
  const width = size * 0.065;
  const gap = width * 1.15;

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${overall} out of 100`}>
        <Arc cx={cx} cy={cy} r={size / 2 - width} pct={environmental} color={RING_COLORS.environmental} width={width} />
        <Arc cx={cx} cy={cy} r={size / 2 - width - gap} pct={social} color={RING_COLORS.social} width={width} />
        <Arc cx={cx} cy={cy} r={size / 2 - width - gap * 2} pct={governance} color={RING_COLORS.governance} width={width} />
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-ink-900" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: size * 0.2 }}>
          {overall}
        </text>
        <text x={cx} y={cy + size * 0.11} textAnchor="middle" className="fill-ink-600" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: size * 0.055 }}>
          / 100
        </text>
      </svg>
      <div className="space-y-2 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: RING_COLORS.environmental }} />
          <span className="text-ink-700">Environmental</span>
          <span className="ml-auto font-semibold text-ink-900">{environmental}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: RING_COLORS.social }} />
          <span className="text-ink-700">Social</span>
          <span className="ml-auto font-semibold text-ink-900">{social}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: RING_COLORS.governance }} />
          <span className="text-ink-700">Governance</span>
          <span className="ml-auto font-semibold text-ink-900">{governance}</span>
        </div>
      </div>
    </div>
  );
}
