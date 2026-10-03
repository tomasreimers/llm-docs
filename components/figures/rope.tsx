import { Figure } from './figure';

// RoPE in one picture: the same word's query/key vector, rotated by an
// angle proportional to its position. Dot products (attention scores)
// depend only on the angle *between* vectors — i.e., on relative position.
// Pair 1: key at position 2, query at position 5. Pair 2: both shifted
// +4 positions. Same angular gap (3θ), same score.
const THETA = 18; // degrees per position step, for legibility

function Dial({
  cx,
  title,
  qPos,
  kPos,
}: {
  cx: number;
  title: string;
  qPos: number;
  kPos: number;
}) {
  const cy = 150;
  const r = 86;
  const arrow = (pos: number, label: string, emph: boolean) => {
    const rad = ((90 - pos * THETA) * Math.PI) / 180;
    const x2 = cx + r * Math.cos(rad);
    const y2 = cy - r * Math.sin(rad);
    const lx = cx + (r + 36) * Math.cos(rad);
    const ly = cy - (r + 36) * Math.sin(rad);
    return (
      <g>
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="currentColor" strokeOpacity={emph ? 0.9 : 0.55} strokeWidth={emph ? 2.5 : 2} />
        <circle cx={x2} cy={y2} r={3.5} fill="currentColor" fillOpacity={0.85} />
        <text x={lx} y={ly + 4} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.8}>
          {label}
        </text>
      </g>
    );
  };

  // arc between the two positions
  const a1 = ((90 - kPos * THETA) * Math.PI) / 180;
  const a2 = ((90 - qPos * THETA) * Math.PI) / 180;
  const ar = 38;
  const arc = `M ${cx + ar * Math.cos(a1)} ${cy - ar * Math.sin(a1)} A ${ar} ${ar} 0 0 1 ${cx + ar * Math.cos(a2)} ${cy - ar * Math.sin(a2)}`;
  const mid = (a1 + a2) / 2;

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeOpacity={0.15} />
      <line x1={cx - r - 8} y1={cy} x2={cx + r + 8} y2={cy} stroke="currentColor" strokeOpacity={0.12} strokeDasharray="3 4" />
      {arrow(kPos, `key, pos ${kPos}`, false)}
      {arrow(qPos, `query, pos ${qPos}`, true)}
      <path d={arc} fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth={1.5} />
      <text x={cx + (ar + 14) * Math.cos(mid)} y={cy - (ar + 14) * Math.sin(mid) + 4} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.8}>
        3θ
      </text>
      <text x={cx} y={cy + r + 56} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.75}>
        {title}
      </text>
    </g>
  );
}

export function RopeFigure() {
  return (
    <Figure caption="RoPE: rotate each query and key by an angle proportional to its position (here θ per step). Attention scores are dot products, and a dot product depends only on the angle between two vectors — so the score for 'query 3 positions after key' is identical wherever the pair sits. Position becomes relative, baked into the geometry.">
      <svg viewBox="0 0 640 310" className="w-full max-w-xl">
        <Dial cx={165} title="key at 2, query at 5 — gap of 3" qPos={5} kPos={2} />
        <Dial cx={475} title="both shifted +4 — same gap, same score" qPos={9} kPos={6} />
        <text x={352} y={155} textAnchor="middle" fontSize={16} fill="currentColor" opacity={0.5}>
          =
        </text>
      </svg>
    </Figure>
  );
}
