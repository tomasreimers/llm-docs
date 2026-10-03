import { Figure } from './figure';

// pass@k = 1 − (1 − p)^k, computed exactly for three per-sample pass rates.
const RATES = [
  { p: 0.5, label: 'p = 50%' },
  { p: 0.2, label: 'p = 20%' },
  { p: 0.05, label: 'p = 5%' },
];
const KMAX = 50;

const X = (k: number) => 64 + (Math.log(k) / Math.log(KMAX)) * 460; // log x
const Y = (v: number) => 250 - v * 210;

function path(p: number) {
  const parts: string[] = [];
  for (let k = 1; k <= KMAX; k++) {
    const v = 1 - Math.pow(1 - p, k);
    parts.push(`${parts.length ? 'L' : 'M'} ${X(k).toFixed(1)} ${Y(v).toFixed(1)}`);
  }
  return parts.join(' ');
}

export function PassAtKFigure() {
  return (
    <Figure caption="pass@k, computed exactly: the probability that at least one of k samples solves the problem, 1 − (1 − p)^k. Even a model that solves a problem 5% of the time passes 92% of the time given 50 tries — which is why pass@1 and pass@50 describe very different products, and why a reported 'pass@k' without the k is a red flag.">
      <svg viewBox="0 0 560 300" className="w-full max-w-xl">
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line x1={64} y1={Y(v)} x2={524} y2={Y(v)} stroke="currentColor" strokeOpacity={0.08} />
            <text x={54} y={Y(v) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>
              {Math.round(v * 100)}%
            </text>
          </g>
        ))}
        {[1, 2, 5, 10, 25, 50].map((k) => (
          <g key={k}>
            <line x1={X(k)} y1={40} x2={X(k)} y2={250} stroke="currentColor" strokeOpacity={0.06} />
            <text x={X(k)} y={268} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
              {k}
            </text>
          </g>
        ))}
        <text x={294} y={292} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7}>
          k — samples allowed (log scale)
        </text>
        <text x={22} y={145} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7} transform="rotate(-90 22 145)">
          pass@k
        </text>

        {RATES.map((r, i) => (
          <g key={r.label}>
            <path
              d={path(r.p)}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.85}
              strokeWidth={2}
              strokeDasharray={i === 1 ? '6 5' : i === 2 ? '2 4' : undefined}
            />
            <text
              x={X(2) + 8}
              y={Y(1 - Math.pow(1 - r.p, 2)) - 9}
              fontSize={11}
              fill="currentColor"
              opacity={0.8}
            >
              {r.label}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}
