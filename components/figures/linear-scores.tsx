import { Figure } from './figure';

// The same flattened "7" vector as in the flatten figure above it.
const VEC = ['0', '0', '0', '⋮', '.9', '.4', '⋮', '0'];

// Deterministic pseudo-random weights for the visible corner of W.
const W_ROWS = Array.from({ length: 10 }, (_, r) =>
  Array.from({ length: 5 }, (_, c) => (((r * 7 + c * 13) % 19) - 9) / 10),
);

const fmt = (v: number) =>
  v === 0 ? '0' : `${v < 0 ? '-' : ''}.${Math.abs(v * 10)}`;

const BIAS = [0.1, 0, -0.2, 0.3, -0.1, 0.2, 0, -0.3, 0.1, -0.2];
// Plausible logits for the "7".
const SCORES = [-1.8, 0.6, 1.1, -0.4, -1.2, 0.2, -2.1, 3.4, 0.9, 1.6];

function Brackets({ x, w, top, h }: { x: number; w: number; top: number; h: number }) {
  return (
    <g>
      <path d={`M ${x} ${top} h -7 v ${h} h 7`} fill="none" stroke="currentColor" strokeOpacity={0.7} />
      <path d={`M ${x + w} ${top} h 7 v ${h} h -7`} fill="none" stroke="currentColor" strokeOpacity={0.7} />
    </g>
  );
}

export function LinearScoresFigure() {
  const top = 30;
  const rowH = 16;
  const h10 = 10 * rowH + 4;

  return (
    <Figure caption="Continuing from the figure above: the same 784-number vector, multiplied by a weight matrix W (one row of 784 learned weights per digit) plus a bias vector b, yields the score vector y. The one-hot vector on the right is the label it will be graded against.">
      <svg viewBox="0 0 700 235" className="w-full max-w-2xl">
        {/* x */}
        <Brackets x={40} w={40} top={top + 12} h={8 * rowH + 4} />
        {VEC.map((v, i) => (
          <text key={i} x={60} y={top + 28 + i * rowH} textAnchor="middle" fontSize={11} fill="currentColor" opacity={v === '0' ? 0.35 : 1}>
            {v}
          </text>
        ))}
        <text x={60} y={top + h10 + 22} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          x (784 × 1)
        </text>

        <text x={105} y={top + 90} textAnchor="middle" fontSize={15} fill="currentColor" opacity={0.7}>
          ×
        </text>

        {/* W */}
        <Brackets x={130} w={192} top={top - 4} h={h10} />
        {W_ROWS.map((row, r) => (
          <g key={r}>
            {row.map((v, c) => (
              <text key={c} x={148 + c * 34} y={top + 8 + r * rowH} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>
                {fmt(v)}
              </text>
            ))}
            <text x={148 + 5 * 34} y={top + 8 + r * rowH} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.45}>
              ⋯
            </text>
          </g>
        ))}
        <text x={226} y={top + h10 + 22} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          W (10 × 784)
        </text>

        <text x={352} y={top + 90} textAnchor="middle" fontSize={14} fill="currentColor" opacity={0.7}>
          +
        </text>

        {/* b */}
        <Brackets x={375} w={36} top={top - 4} h={h10} />
        {BIAS.map((v, i) => (
          <text key={i} x={393} y={top + 8 + i * rowH} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>
            {fmt(v)}
          </text>
        ))}
        <text x={393} y={top + h10 + 22} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          b (10 × 1)
        </text>

        <text x={437} y={top + 90} textAnchor="middle" fontSize={14} fill="currentColor" opacity={0.7}>
          =
        </text>

        {/* digit labels + y */}
        {SCORES.map((_, d) => (
          <text key={d} x={462} y={top + 8 + d * rowH} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.5}>
            {d}
          </text>
        ))}
        <Brackets x={482} w={44} top={top - 4} h={h10} />
        {SCORES.map((s, d) => {
          const best = d === 7;
          return (
            <g key={d}>
              {best && <rect x={482} y={top - 2 + d * rowH} width={44} height={rowH - 3} rx={2} fill="currentColor" fillOpacity={0.1} />}
              <text x={504} y={top + 8 + d * rowH} textAnchor="middle" fontSize={9.5} fontWeight={best ? 700 : 400} fill="currentColor" opacity={best ? 1 : 0.8}>
                {s.toFixed(1)}
              </text>
            </g>
          );
        })}
        <text x={504} y={top + h10 + 22} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          y (10 × 1)
        </text>
        <text x={504} y={top + h10 + 38} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.55}>
          one score per digit
        </text>

        {/* one-hot label */}
        <text x={620} y={top - 14} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.7}>
          the label, one-hot:
        </text>
        <Brackets x={600} w={40} top={top - 4} h={h10} />
        {SCORES.map((_, d) => {
          const hot = d === 7;
          return (
            <g key={d}>
              {hot && <rect x={600} y={top - 2 + d * rowH} width={40} height={rowH - 3} rx={2} fill="currentColor" fillOpacity={0.1} />}
              <text x={620} y={top + 8 + d * rowH} textAnchor="middle" fontSize={9.5} fontWeight={hot ? 700 : 400} fill="currentColor" opacity={hot ? 1 : 0.5}>
                {hot ? 1 : 0}
              </text>
            </g>
          );
        })}
        <text x={620} y={top + h10 + 22} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          (10 × 1)
        </text>
      </svg>
    </Figure>
  );
}
