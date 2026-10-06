import { Figure } from './figure';

// Over-training, drawn correctly: hold the model size fixed and drop to a
// lower iso-FLOP curve by training longer. Honest math: same corrected
// Chinchilla fit as the figure above (Besiroglu et al. 2024).
//
// Curve 1: C = 1e22 — the budget whose compute-optimal model is ~8-9B.
// Curve 2: C = 6·8e9·15e12 ≈ 7.2e23 — Llama 3 8B's actual training spend.
// Over-training moves the 8B model vertically from curve 1 to curve 2.
const E = 1.82;
const A = 482.01;
const B = 2085.43;
const ALPHA = 0.3478;
const BETA = 0.3658;
const loss = (n: number, c: number) => E + A / Math.pow(n, ALPHA) + B / Math.pow(c / (6 * n), BETA);

const C_OPT = 1e22;
const C_LLAMA = 6 * 8e9 * 15e12; // 7.2e23
const N_LLAMA = 8e9;

function minimum(c: number) {
  let best = { l: Infinity, logN: 0 };
  for (let logN = 9; logN <= 12.5; logN += 0.005) {
    const l = loss(Math.pow(10, logN), c);
    if (l < best.l) best = { l, logN };
  }
  return best;
}

// x: log10(N) ∈ [9.4, 11.9]; y: loss ∈ [1.95, 2.3], increasing upward
const X = (logN: number) => 70 + ((logN - 9.4) / 2.5) * 460;
const Y = (l: number) => 25 + ((2.3 - l) / 0.35) * 200; // 2.3 → 25 (top), 1.95 → 225 (bottom)

function path(c: number, lo: number, hi: number) {
  const parts: string[] = [];
  for (let logN = lo; logN <= hi + 1e-9; logN += 0.05) {
    const l = loss(Math.pow(10, logN), c);
    if (l > 2.3) continue;
    parts.push(`${parts.length ? 'L' : 'M'} ${X(logN).toFixed(1)} ${Y(l).toFixed(1)}`);
  }
  return parts.join(' ');
}

export function OvertrainFigure() {
  const logNL = Math.log10(N_LLAMA);
  const start = { logN: logNL, l: loss(N_LLAMA, C_OPT) }; // ≈ the 1e22 curve's minimum
  const end = { logN: logNL, l: loss(N_LLAMA, C_LLAMA) };
  const bigMin = minimum(C_LLAMA);
  const ratio = Math.round(C_LLAMA / C_OPT);

  return (
    <Figure caption="Over-training on the iso-FLOP map: Chinchilla says an 8B model has 'earned' only the ~10²²-FLOP budget whose optimum it is (upper dot). Llama 3 kept training anyway — 72× that compute — dropping the same-size model to a much lower curve (lower dot), far left of that budget's own optimum. What you buy: loss 2.14 → 2.03 at an unchanged serving cost of 2N ≈ 16 GFLOPs per token. What you decline: that budget's optimal 81B model (small dot) — better loss, but 10× the serving cost, forever.">
      <svg viewBox="0 0 560 320" className="w-full max-w-xl">
        {/* axes */}
        {[10, 11].map((d) => (
          <g key={d}>
            <line x1={X(d)} y1={25} x2={X(d)} y2={225} stroke="currentColor" strokeOpacity={0.08} />
            <text x={X(d)} y={243} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
              {d === 10 ? '10B' : '100B'}
            </text>
          </g>
        ))}
        {[2.0, 2.1, 2.2, 2.3].map((l) => (
          <g key={l}>
            <line x1={70} y1={Y(l)} x2={530} y2={Y(l)} stroke="currentColor" strokeOpacity={0.08} />
            <text x={58} y={Y(l) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>
              {l.toFixed(1)}
            </text>
          </g>
        ))}
        <text x={20} y={125} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.75} transform="rotate(-90 20 125)">
          loss
        </text>
        <text x={300} y={266} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          parameters N (log scale)
        </text>

        {/* curves */}
        <path d={path(C_OPT, 9.4, 11.0)} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={2} />
        <text x={93} y={85} fontSize={11} fill="currentColor" opacity={0.65}>
          10²² FLOPs (optimal for 8B)
        </text>
        <path d={path(C_LLAMA, 9.4, 11.9)} fill="none" stroke="currentColor" strokeOpacity={0.8} strokeWidth={2} />
        <text x={528} y={Y(loss(Math.pow(10, 11.9), C_LLAMA)) - 14} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.75}>
          7.2×10²³ — Llama 3 8B&apos;s spend
        </text>

        {/* the drop */}
        <defs>
          <marker id="ot-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.7} />
          </marker>
        </defs>
        <circle cx={X(start.logN)} cy={Y(start.l)} r={4.5} fill="currentColor" />
        <text x={X(start.logN) + 14} y={Y(start.l) + 16} fontSize={11} fill="currentColor" opacity={0.85}>
          Chinchilla-optimal for 8B: loss {start.l.toFixed(2)}
        </text>
        <line
          x1={X(start.logN)}
          y1={Y(start.l) + 8}
          x2={X(end.logN)}
          y2={Y(end.l) - 9}
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth={1.8}
          strokeDasharray="5 4"
          markerEnd="url(#ot-arrow)"
        />
        <text x={X(start.logN) + 14} y={(Y(start.l) + Y(end.l)) / 2 + 12} fontSize={10.5} fill="currentColor" opacity={0.75}>
          over-train: {ratio}× the compute, same size
        </text>
        <circle cx={X(end.logN)} cy={Y(end.l)} r={5} fill="none" stroke="currentColor" strokeWidth={2} />
        <text x={X(end.logN) - 12} y={Y(end.l) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.85}>
          Llama 3 8B: {end.l.toFixed(2)}
        </text>

        {/* the declined optimum of the big budget */}
        <circle cx={X(bigMin.logN)} cy={Y(bigMin.l)} r={3.5} fill="currentColor" fillOpacity={0.55} />
        <text x={X(bigMin.logN) + 12} y={Y(bigMin.l) + 16} fontSize={10.5} fill="currentColor" opacity={0.6}>
          this budget&apos;s optimum: 81B
        </text>
      </svg>
    </Figure>
  );
}
