import { Figure } from './figure';

// Honest math: curves are L(N, D) = E + A/N^α + B/D^β with the corrected
// Chinchilla fit from Besiroglu et al. (2024): E=1.82, A=482.01, B=2085.43,
// α=0.3478, β=0.3658 — the fit whose minima actually reproduce the famous
// ~20-tokens-per-parameter rule. Along each curve, compute is held fixed
// (C = 6ND), so moving right trades training tokens for parameters.
const E = 1.82;
const A = 482.01;
const B = 2085.43;
const ALPHA = 0.3478;
const BETA = 0.3658;
const loss = (n: number, d: number) => E + A / Math.pow(n, ALPHA) + B / Math.pow(d, BETA);
const lossAtBudget = (c: number, logN: number) => {
  const n = Math.pow(10, logN);
  return loss(n, c / (6 * n));
};

// x: log10(N) ∈ [8.8, 12.2]; y: loss ∈ [1.9, 2.45]
const X = (logN: number) => 70 + ((logN - 8.8) / 3.4) * 460;
const Y = (l: number) => 268 - ((l - 1.9) / 0.55) * 243; // loss increases upward: 1.9 → bottom, 2.45 → top

const BUDGETS: Array<{ c: number; label: string; lo: number; hi: number }> = [
  { c: 1e22, label: '10²² FLOPs', lo: 8.8, hi: 10.9 },
  { c: 1e23, label: '10²³', lo: 9.0, hi: 11.5 },
  { c: 1e24, label: '10²⁴', lo: 9.4, hi: 12.2 },
];

function minimum(c: number) {
  let best = { l: Infinity, logN: 0 };
  for (let logN = 8.5; logN <= 12.5; logN += 0.005) {
    const l = lossAtBudget(c, logN);
    if (l < best.l) best = { l, logN };
  }
  return best;
}

function path(c: number, lo: number, hi: number) {
  const parts: string[] = [];
  for (let logN = lo; logN <= hi + 1e-9; logN += 0.05) {
    const l = lossAtBudget(c, logN);
    if (l > 2.46) continue;
    parts.push(`${parts.length ? 'L' : 'M'} ${X(logN).toFixed(1)} ${Y(l).toFixed(1)}`);
  }
  return parts.join(' ');
}

export function ChinchillaFigure() {
  const minima = BUDGETS.map((b) => minimum(b.c));
  // Llama 3 8B: N = 8e9, D = 15e12 — far left of its own budget's optimum
  const llama = { logN: Math.log10(8e9), l: loss(8e9, 15e12) };

  return (
    <Figure caption="Iso-FLOP curves from the (corrected) Chinchilla fit: each curve holds total training compute fixed and trades model size against training tokens. Every budget has a sweet spot, and the sweet spots line up at roughly 20 tokens per parameter. Llama 3 8B sits deliberately far left of its optimum: worse loss per training FLOP, bought on purpose, because a small model is cheaper on every token it will ever serve.">
      <svg viewBox="0 0 560 320" className="w-full max-w-xl">
        {/* axes */}
        {[9, 10, 11, 12].map((d) => (
          <g key={d}>
            <line x1={X(d)} y1={25} x2={X(d)} y2={268} stroke="currentColor" strokeOpacity={0.08} />
            <text x={X(d)} y={286} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
              {d === 9 ? '1B' : d === 10 ? '10B' : d === 11 ? '100B' : '1T'}
            </text>
          </g>
        ))}
        {[2.0, 2.1, 2.2, 2.3, 2.4].map((l) => (
          <g key={l}>
            <line x1={70} y1={Y(l)} x2={530} y2={Y(l)} stroke="currentColor" strokeOpacity={0.08} />
            <text x={58} y={Y(l) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>
              {l.toFixed(1)}
            </text>
          </g>
        ))}
        <text x={300} y={312} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.75}>
          parameters N (log scale) — training tokens D = C / 6N
        </text>
        <text x={20} y={146} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.75} transform="rotate(-90 20 146)">
          loss
        </text>

        {/* line through the minima (extended at both ends) */}
        {(() => {
          const x1 = X(minima[0].logN);
          const y1 = Y(minima[0].l);
          const x2 = X(minima[2].logN);
          const y2 = Y(minima[2].l);
          const slope = (y2 - y1) / (x2 - x1);
          return (
            <line
              x1={x1 - 55}
              y1={y1 - 55 * slope}
              x2={x2 + 40}
              y2={y2 + 40 * slope}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeDasharray="5 5"
            />
          );
        })()}

        {/* iso-FLOP curves */}
        {BUDGETS.map((b, i) => (
          <g key={b.label}>
            <path d={path(b.c, b.lo, b.hi)} fill="none" stroke="currentColor" strokeOpacity={0.45 + i * 0.18} strokeWidth={2} />
            <circle cx={X(minima[i].logN)} cy={Y(minima[i].l)} r={4.5} fill="currentColor" />
            <text
              x={X(b.lo) + (i === 0 ? 10 : 2)}
              y={Y(lossAtBudget(b.c, b.lo + (i === 0 ? 0.12 : 0.02))) - 8}
              fontSize={11}
              fill="currentColor"
              opacity={0.7}
            >
              {b.label}
            </text>
          </g>
        ))}
        <text x={X(minima[2].logN) + 46} y={Y(minima[2].l) + 30} fontSize={11} fill="currentColor" opacity={0.75} textAnchor="start">
          ≈ 20 tokens/param
        </text>

        {/* Llama 3 8B */}
        <circle cx={X(llama.logN)} cy={Y(llama.l)} r={5} fill="none" stroke="currentColor" strokeWidth={2} />
        <text x={X(llama.logN) - 11} y={Y(llama.l) + 4} fontSize={11} fill="currentColor" opacity={0.8} textAnchor="end">
          Llama 3 8B (1,875 tok/param)
        </text>
      </svg>
    </Figure>
  );
}
