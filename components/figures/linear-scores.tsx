import { ACCENT, Figure } from './figure';

// The same flattened "7" vector as in the flatten figure above it.
const VEC = ['0', '0', '0', '⋮', '.9', '.4', '⋮', '0'];

// Deterministic pseudo-random weights for the visible corner of W.
const W_ROWS = Array.from({ length: 10 }, (_, r) =>
  Array.from({ length: 5 }, (_, c) => (((r * 7 + c * 13) % 19) - 9) / 10),
);

const fmt = (v: number) =>
  v === 0 ? '0' : `${v < 0 ? '-' : ''}.${Math.abs(v * 10)}`;

// Plausible logits for the "7".
const SCORES = [-1.8, 0.6, 1.1, -0.4, -1.2, 0.2, -2.1, 3.4, 0.9, 1.6];
const MAX = Math.max(...SCORES);

export function LinearScoresFigure() {
  const top = 30;
  const vecX = 40;
  const wX = 130;
  const barX = 420;
  const rowH = 16;

  return (
    <Figure caption="Continuing from the figure above: the same 784-number vector, multiplied by a weight matrix W — one row of 784 learned weights per digit, plus a bias — produces 10 scores. The label the model is graded against is the one-hot column on the right.">
      <svg viewBox="0 0 680 230" className="w-full max-w-2xl">
        {/* x: the vector from the flatten figure */}
        <path d={`M ${vecX} ${top - 4} h -8 v 140 h 8`} fill="none" stroke="currentColor" strokeOpacity={0.7} />
        <path d={`M ${vecX + 40} ${top - 4} h 8 v 140 h -8`} fill="none" stroke="currentColor" strokeOpacity={0.7} />
        {VEC.map((v, i) => (
          <text key={i} x={vecX + 20} y={top + 14 + i * 16} textAnchor="middle" fontSize={11} fill="currentColor" opacity={v === '0' ? 0.35 : 1}>
            {v}
          </text>
        ))}
        <text x={vecX + 20} y={top + 160} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          x (784 × 1)
        </text>

        <text x={vecX + 70} y={top + 70} textAnchor="middle" fontSize={15} fill="currentColor" opacity={0.7}>
          ×
        </text>

        {/* W: an actual matrix */}
        <path d={`M ${wX} ${top - 4} h -8 v ${10 * rowH + 8} h 8`} fill="none" stroke={ACCENT.blue} />
        <path d={`M ${wX + 195} ${top - 4} h 8 v ${10 * rowH + 8} h -8`} fill="none" stroke={ACCENT.blue} />
        {W_ROWS.map((row, r) => (
          <g key={r}>
            {row.map((v, c) => (
              <text key={c} x={wX + 18 + c * 34} y={top + 11 + r * rowH} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>
                {fmt(v)}
              </text>
            ))}
            <text x={wX + 18 + 5 * 34} y={top + 11 + r * rowH} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.45}>
              ⋯
            </text>
          </g>
        ))}
        <text x={wX + 97} y={top + 10 * rowH + 24} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          W (10 × 784) — one row per digit
        </text>

        <text x={wX + 240} y={top + 70} textAnchor="middle" fontSize={13} fill="currentColor" opacity={0.7}>
          + b =
        </text>

        {/* the 10 scores */}
        {SCORES.map((s, d) => {
          const w = Math.max(((s + 2.5) / (MAX + 2.5)) * 130, 3);
          const best = s === MAX;
          return (
            <g key={d}>
              <text x={barX - 8} y={top + d * rowH + 10} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.8}>
                {d}
              </text>
              <rect x={barX} y={top + d * rowH + 2} width={w} height={rowH - 6} rx={2} fill={best ? ACCENT.blue : 'currentColor'} fillOpacity={best ? 0.95 : 0.25} />
              <text x={barX + w + 5} y={top + d * rowH + 10} fontSize={9} fill="currentColor" opacity={0.6}>
                {s.toFixed(1)}
              </text>
            </g>
          );
        })}
        <text x={barX + 65} y={top + 10 * rowH + 24} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          y: one score per digit
        </text>

        {/* one-hot label */}
        <text x={barX + 205} y={top - 10} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.7}>
          the label, one-hot:
        </text>
        {SCORES.map((_, d) => (
          <g key={d}>
            <rect x={barX + 199} y={top + d * rowH + 2} width={rowH - 6} height={rowH - 6} rx={2} fill={d === 7 ? ACCENT.green : 'none'} stroke="currentColor" strokeOpacity={0.25} />
            <text x={barX + 199 + (rowH - 6) / 2} y={top + d * rowH + 10} textAnchor="middle" fontSize={8} fill={d === 7 ? 'white' : 'currentColor'} opacity={d === 7 ? 1 : 0.5}>
              {d === 7 ? 1 : 0}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}
