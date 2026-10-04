import { Figure } from './figure';

// Quantization quality curve, from real measurements: llama.cpp k-quants
// (PR #1684), LLaMA-7B, WikiText-2 perplexity. Bits-per-weight computed
// honestly from published file sizes (size / 13.0 GB fp16 × 16):
//   fp16    16.0 bpw  ppl 5.9066  (baseline)
//   Q6_K     6.3 bpw  ppl 5.9110  (+0.07%)
//   Q5_K_M   5.5 bpw  ppl 5.9208  (+0.24%)
//   Q4_K_M   4.7 bpw  ppl 5.9601  (+0.91%)
//   Q3_K_M   3.8 bpw  ppl 6.1503  (+4.1%)
//   Q2_K     3.3 bpw  ppl 6.7764  (+14.7%)

const PTS = [
  { bits: 3.3, ppl: 6.7764 },
  { bits: 3.8, ppl: 6.1503 },
  { bits: 4.7, ppl: 5.9601 },
  { bits: 5.5, ppl: 5.9208 },
  { bits: 6.3, ppl: 5.911 },
  { bits: 16, ppl: 5.9066 },
];

const X = (bits: number) => 50 + ((bits - 2) / 15) * 480;
const Y = (ppl: number) => 40 + ((6.9 - ppl) / 1.1) * 210;

export function QuantQualityFigure() {
  const line = PTS.map((p) => `${X(p.bits).toFixed(1)},${Y(p.ppl).toFixed(1)}`).join(' ');
  return (
    <Figure caption="The quantization quality curve, measured (llama.cpp k-quants, LLaMA-7B, WikiText-2 perplexity; bits per weight computed from actual file sizes). From 16 bits down to ~5, quality is flat to within a quarter percent; ~4.7 bits costs 0.9%; then the knee — 3.8 bits costs 4%, and 3.3 bits costs 15%. Model quality is remarkably indifferent to precision, until just below 4 bits it suddenly isn't.">
      <svg viewBox="0 0 580 300" className="w-full max-w-xl">
        {/* axes */}
        <line x1={50} y1={30} x2={50} y2={255} stroke="currentColor" strokeOpacity={0.3} />
        <line x1={44} y1={255} x2={540} y2={255} stroke="currentColor" strokeOpacity={0.3} />
        {[5.9, 6.2, 6.5, 6.8].map((v) => (
          <g key={v}>
            <line x1={46} y1={Y(v)} x2={540} y2={Y(v)} stroke="currentColor" strokeOpacity={0.06} />
            <text x={40} y={Y(v) + 3.5} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.6}>
              {v.toFixed(1)}
            </text>
          </g>
        ))}
        {[4, 8, 12, 16].map((b) => (
          <text key={b} x={X(b)} y={271} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.6}>
            {b}
          </text>
        ))}
        <text x={295} y={292} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.8}>
          bits per weight (file size ÷ parameter count)
        </text>
        <text x={16} y={142} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.8} transform="rotate(-90 16 142)">
          perplexity (worse ↑)
        </text>

        {/* fp16 baseline */}
        <line x1={50} y1={Y(5.9066)} x2={540} y2={Y(5.9066)} stroke="currentColor" strokeOpacity={0.25} strokeDasharray="4 4" />
        <text x={538} y={Y(5.9066) + 14} textAnchor="end" fontSize={9.5} fill="currentColor" opacity={0.55}>
          fp16 baseline — ppl 5.907
        </text>

        {/* the knee */}
        <line x1={X(4)} y1={30} x2={X(4)} y2={255} stroke="currentColor" strokeOpacity={0.18} strokeDasharray="4 4" />
        <text x={X(4)} y={24} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.6}>
          ~4 bits: the knee
        </text>

        {/* curve */}
        <polyline points={line} fill="none" stroke="currentColor" strokeOpacity={0.75} strokeWidth={2} />
        {PTS.map((p) => (
          <circle key={p.bits} cx={X(p.bits)} cy={Y(p.ppl)} r={4} fill="currentColor" />
        ))}

        {/* point labels */}
        <text x={X(3.3) + 9} y={Y(6.7764) + 3} textAnchor="start" fontSize={9.5} fill="currentColor" opacity={0.8}>
          3.3-bit: +15%
        </text>
        <text x={X(3.8) + 9} y={Y(6.1503) - 6} textAnchor="start" fontSize={9.5} fill="currentColor" opacity={0.8}>
          3.8-bit: +4%
        </text>
        <text x={X(4.7)} y={Y(5.9601) + 24} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.8}>
          4.7-bit: +0.9%
        </text>
        <text x={X(7)} y={Y(5.92) - 16} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.8}>
          5.5 / 6.3-bit: +0.2% / +0.1%
        </text>
        <text x={X(16)} y={Y(5.9066) - 10} textAnchor="end" fontSize={9.5} fill="currentColor" opacity={0.8}>
          fp16
        </text>
      </svg>
    </Figure>
  );
}
