import { Figure } from './figure';

// x: training step 0..1 → px 55..530; y: loss 0..3.2 → px 250..25
const X = (t: number) => 55 + t * 475;
const Y = (l: number) => 250 - (Math.min(l, 3.2) / 3.2) * 225;

const noise = (t: number) => 0.05 * Math.sin(37 * t) + 0.04 * Math.sin(91 * t);

function path(f: (t: number) => number) {
  return Array.from({ length: 101 }, (_, i) => {
    const t = i / 100;
    return `${i === 0 ? 'M' : 'L'} ${X(t).toFixed(1)} ${Y(f(t)).toFixed(1)}`;
  }).join(' ');
}

const healthy = (t: number) => 2.3 * Math.exp(-5 * t) + 0.12 + noise(t) * (0.3 + t);
const tooLow = (t: number) => 2.3 - 0.5 * t + 0.3 * noise(t);
const tooHigh = (t: number) =>
  t < 0.12 ? 2.3 - 2 * t : 2.06 + 14 * (t - 0.12) ** 2 + noise(t);

export function LossCurvesFigure() {
  return (
    <Figure caption="The three loss curves every practitioner learns to read at a glance. Almost always, the knob that separates them is the learning rate.">
      <svg viewBox="0 0 600 290" className="w-full max-w-xl">
        <line x1={55} y1={250} x2={530} y2={250} stroke="currentColor" strokeOpacity={0.3} />
        <line x1={55} y1={250} x2={55} y2={25} stroke="currentColor" strokeOpacity={0.3} />
        <text x={292} y={275} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7}>
          training steps
        </text>
        <text x={26} y={140} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7} transform="rotate(-90 26 140)">
          loss
        </text>
        {/* loss at init marker */}
        <line x1={55} y1={Y(2.3)} x2={530} y2={Y(2.3)} stroke="currentColor" strokeOpacity={0.18} strokeDasharray="4 4" />
        <text x={526} y={Y(2.3) - 6} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.55}>
          loss at init ≈ ln(10) ≈ 2.3
        </text>
        <path d={path(tooHigh)} fill="none" stroke="currentColor" strokeOpacity={0.85} strokeWidth={2} strokeDasharray="2 4" />
        <path d={path(tooLow)} fill="none" stroke="currentColor" strokeOpacity={0.85} strokeWidth={2} strokeDasharray="8 4" />
        <path d={path(healthy)} fill="none" stroke="currentColor" strokeOpacity={0.9} strokeWidth={2.5} />
        <text x={262} y={52} fontSize={11.5} fill="currentColor" opacity={0.85}>
          learning rate too high: diverges
        </text>
        <text x={385} y={Y(1.95)} fontSize={11.5} fill="currentColor" opacity={0.85}>
          too low: crawls
        </text>
        <text x={300} y={Y(0.12) - 12} fontSize={11.5} fill="currentColor" opacity={0.85}>
          healthy: fast drop, long tail
        </text>
      </svg>
    </Figure>
  );
}
