import { Figure } from './figure';

// x: log10(training FLOPs), 18..26 → px 60..530
// y: loss 1.8..5.0 → px 270..20
const x = (logC: number) => 60 + ((logC - 18) / 8) * 470;
const y = (loss: number) => 270 - ((5 - loss) / 3.2) * 250;

const POINTS: Array<{ logC: number; loss: number; label: string }> = [
  { logC: 21, loss: 3.75, label: 'GPT-2 era' },
  { logC: 23.5, loss: 2.88, label: 'GPT-3 era' },
  { logC: 25.5, loss: 2.18, label: 'frontier' },
];

export function ScalingLawsFigure() {
  return (
    <Figure caption="The straight line that reorganized an industry: loss falls as a power law in training compute, across eight orders of magnitude. Illustrative rendering, after Kaplan et al. (2020).">
      <svg viewBox="0 0 560 320" className="w-full max-w-xl">
        {(
          [
            [18, '10¹⁸'],
            [20, '10²⁰'],
            [22, '10²²'],
            [24, '10²⁴'],
            [26, '10²⁶'],
          ] as Array<[number, string]>
        ).map(([d, label]) => (
          <g key={d}>
            <line x1={x(d)} y1={20} x2={x(d)} y2={270} stroke="currentColor" strokeOpacity={0.1} />
            <text x={x(d)} y={290} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.6}>
              {label}
            </text>
          </g>
        ))}
        {[2, 3, 4, 5].map((l) => (
          <g key={l}>
            <line x1={60} y1={y(l)} x2={530} y2={y(l)} stroke="currentColor" strokeOpacity={0.1} />
            <text x={46} y={y(l) + 4} textAnchor="end" fontSize={12} fill="currentColor" opacity={0.6}>
              {l.toFixed(1)}
            </text>
          </g>
        ))}
        <text x={295} y={312} textAnchor="middle" fontSize={13} fill="currentColor" opacity={0.8}>
          training compute (FLOPs, log scale)
        </text>
        <text x={18} y={145} textAnchor="middle" fontSize={13} fill="currentColor" opacity={0.8} transform="rotate(-90 18 145)">
          loss
        </text>
        <line x1={x(18)} y1={y(4.8)} x2={x(26)} y2={y(2.0)} stroke="currentColor" strokeOpacity={0.8} strokeWidth={2.5} />
        {POINTS.map((p) => (
          <g key={p.label}>
            <circle cx={x(p.logC)} cy={y(p.loss)} r={5} fill="currentColor" />
            <text x={x(p.logC) + 10} y={y(p.loss) - 8} fontSize={12} fill="currentColor" opacity={0.8}>
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}
