import { ACCENT, Figure } from './figure';

// Plausible logits for the "7" from the flatten figure.
const SCORES = [-1.8, 0.6, 1.1, -0.4, -1.2, 0.2, -2.1, 3.4, 0.9, 1.6];
const MAX = Math.max(...SCORES);

export function LinearScoresFigure() {
  const barX = 330;
  const rowH = 17;
  const top = 25;

  return (
    <Figure caption="The linear classifier at work: multiplying the 784-vector by W (one learned template per digit, plus a bias) yields 10 scores. The label the model is graded against is the same 10 numbers in one-hot form — all mass on the right answer.">
      <svg viewBox="0 0 640 230" className="w-full max-w-xl">
        {/* x */}
        <rect x={30} y={top + 15} width={26} height={150} rx={4} fill="none" stroke="currentColor" strokeOpacity={0.6} />
        <text x={43} y={top + 95} textAnchor="middle" fontSize={12} fill="currentColor" transform={`rotate(-90 43 ${top + 95})`}>
          x (784 numbers)
        </text>
        <text x={78} y={top + 95} textAnchor="middle" fontSize={15} fill="currentColor" opacity={0.7}>
          ×
        </text>
        {/* W */}
        <rect x={100} y={top + 55} width={150} height={70} rx={4} fill={`${ACCENT.blue}1a`} stroke={ACCENT.blue} />
        <text x={175} y={top + 85} textAnchor="middle" fontSize={12.5} fill="currentColor">
          W (10 × 784)
        </text>
        <text x={175} y={top + 103} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.6}>
          one row = one digit template
        </text>
        <text x={268} y={top + 95} textAnchor="middle" fontSize={13} fill="currentColor" opacity={0.7}>
          + b =
        </text>
        {/* scores */}
        {SCORES.map((s, d) => {
          const w = Math.max(((s + 2.5) / (MAX + 2.5)) * 170, 3);
          const best = s === MAX;
          return (
            <g key={d}>
              <text x={barX - 10} y={top + d * rowH + 11} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.8}>
                {d}
              </text>
              <rect
                x={barX}
                y={top + d * rowH + 2}
                width={w}
                height={rowH - 6}
                rx={2}
                fill={best ? ACCENT.blue : 'currentColor'}
                fillOpacity={best ? 0.95 : 0.25}
              />
              <text x={barX + w + 6} y={top + d * rowH + 11} fontSize={9.5} fill="currentColor" opacity={0.6}>
                {s.toFixed(1)}
              </text>
            </g>
          );
        })}
        <text x={barX + 85} y={top + 10 * rowH + 14} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          y: one score per digit
        </text>
        {/* one-hot label */}
        <text x={barX + 211} y={top - 7} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>
          the label, one-hot:
        </text>
        {SCORES.map((s, d) => (
          <g key={d}>
            <rect
              x={barX + 205}
              y={top + d * rowH + 2}
              width={rowH - 6}
              height={rowH - 6}
              rx={2}
              fill={d === 7 ? ACCENT.green : 'none'}
              fillOpacity={d === 7 ? 0.9 : 1}
              stroke="currentColor"
              strokeOpacity={0.25}
            />
            <text
              x={barX + 205 + (rowH - 6) / 2}
              y={top + d * rowH + 11}
              textAnchor="middle"
              fontSize={8.5}
              fill={d === 7 ? 'white' : 'currentColor'}
              opacity={d === 7 ? 1 : 0.5}
            >
              {d === 7 ? 1 : 0}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}
