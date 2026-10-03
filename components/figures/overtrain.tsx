import { Figure } from './figure';

// The over-training trade, zoomed to one budget. Honest math: the same
// corrected Chinchilla fit as the iso-FLOP figure (Besiroglu et al. 2024),
// evaluated along Llama 3 8B's actual training budget C = 6·8e9·15e12
// ≈ 7.2e23 FLOPs. Serving cost per generated token ≈ 2N FLOPs.
const E = 1.82;
const A = 482.01;
const B = 2085.43;
const ALPHA = 0.3478;
const BETA = 0.3658;
const C = 6 * 8e9 * 15e12; // 7.2e23
const loss = (n: number) => E + A / Math.pow(n, ALPHA) + B / Math.pow(C / (6 * n), BETA);

function minimum() {
  let best = { l: Infinity, logN: 0 };
  for (let logN = 9; logN <= 12.5; logN += 0.005) {
    const l = loss(Math.pow(10, logN));
    if (l < best.l) best = { l, logN };
  }
  return best;
}

// x: log10(N) ∈ [9.5, 12.2]; y: loss ∈ [1.95, 2.1]
const X = (logN: number) => 70 + ((logN - 9.5) / 2.7) * 460;
const Y = (l: number) => 35 + ((2.1 - l) / 0.15) * 180; // loss increases upward: 2.1 → top, 1.95 → bottom

const LLAMA_LOGN = Math.log10(8e9); // 9.903

export function OvertrainFigure() {
  const opt = minimum();
  const llama = { logN: LLAMA_LOGN, l: loss(8e9) };
  const servedOpt = (2 * Math.pow(10, opt.logN)) / 1e9; // GFLOPs per generated token
  const servedLlama = (2 * 8e9) / 1e9;

  const path = (() => {
    const parts: string[] = [];
    for (let logN = 9.5; logN <= 12.2 + 1e-9; logN += 0.05) {
      const l = loss(Math.pow(10, logN));
      if (l > 2.105) continue;
      parts.push(`${parts.length ? 'L' : 'M'} ${X(logN).toFixed(1)} ${Y(l).toFixed(1)}`);
    }
    return parts.join(' ');
  })();

  return (
    <Figure caption="The over-training trade, on Llama 3 8B's actual budget (C ≈ 7×10²³ FLOPs, same corrected fit as above). Sliding left along the iso-FLOP curve costs a little loss — 2.03 instead of the optimal 1.97 — and shrinks the model 10×. Training compute is spent once; the serving cost below is paid on every token the model ever generates.">
      <svg viewBox="0 0 560 365" className="w-full max-w-xl">
        {/* axes */}
        {[10, 11, 12].map((d) => (
          <g key={d}>
            <line x1={X(d)} y1={30} x2={X(d)} y2={215} stroke="currentColor" strokeOpacity={0.08} />
            <text x={X(d)} y={233} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
              {d === 10 ? '10B' : d === 11 ? '100B' : '1T'}
            </text>
          </g>
        ))}
        {[1.95, 2.0, 2.05, 2.1].map((l) => (
          <g key={l}>
            <line x1={70} y1={Y(l)} x2={530} y2={Y(l)} stroke="currentColor" strokeOpacity={0.08} />
            <text x={58} y={Y(l) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>
              {l.toFixed(2)}
            </text>
          </g>
        ))}
        <text x={20} y={125} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.75} transform="rotate(-90 20 125)">
          loss
        </text>
        <text x={300} y={252} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          parameters N at fixed training compute (tokens D = C / 6N)
        </text>

        {/* the single iso-FLOP curve */}
        <path d={path} fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth={2} />

        {/* optimal point */}
        <circle cx={X(opt.logN)} cy={Y(opt.l)} r={4.5} fill="currentColor" />
        <text x={X(opt.logN) + 44} y={Y(opt.l) + 20} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.8}>
          compute-optimal: {Math.round(Math.pow(10, opt.logN) / 1e9)}B, loss {opt.l.toFixed(2)}
        </text>

        {/* llama point */}
        <circle cx={X(llama.logN)} cy={Y(llama.l)} r={5} fill="none" stroke="currentColor" strokeWidth={2} />
        <text x={X(llama.logN) - 4} y={Y(llama.l) - 14} textAnchor="start" fontSize={11} fill="currentColor" opacity={0.85}>
          Llama 3 8B: loss {llama.l.toFixed(2)}
        </text>

        {/* slide arrow along the curve */}
        <defs>
          <marker id="ot-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.6} />
          </marker>
        </defs>
        <path
          d={`M ${X(opt.logN) - 14} ${Y(loss(Math.pow(10, opt.logN - 0.12))) - 8} Q ${X((opt.logN + llama.logN) / 2)} ${Y(llama.l) - 32}, ${X(llama.logN) + 16} ${Y(llama.l) - 26}`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeDasharray="4 4"
          markerEnd="url(#ot-arrow)"
        />
        <text x={X((opt.logN + llama.logN) / 2) + 10} y={Y(llama.l) - 44} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.7}>
          same training budget, smaller model
        </text>

        {/* serving cost bars */}
        <text x={70} y={288} fontSize={11} fill="currentColor" opacity={0.75}>
          serving cost per generated token (2N FLOPs):
        </text>
        <rect x={70} y={298} width={(servedOpt / servedOpt) * 380} height={14} rx={2} fill="currentColor" fillOpacity={0.35} />
        <text x={70 + 380 + 8} y={309} fontSize={10.5} fill="currentColor" opacity={0.8}>
          {Math.round(servedOpt)} GFLOPs
        </text>
        <rect x={70} y={320} width={(servedLlama / servedOpt) * 380} height={14} rx={2} fill="currentColor" fillOpacity={0.75} />
        <text x={70 + (servedLlama / servedOpt) * 380 + 8} y={331} fontSize={10.5} fill="currentColor" opacity={0.8}>
          {Math.round(servedLlama)} GFLOPs — {Math.round(servedOpt / servedLlama)}× cheaper, forever
        </text>
      </svg>
    </Figure>
  );
}
