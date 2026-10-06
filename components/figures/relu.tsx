import { Figure } from './figure';

// The ReLU hinge: flat at zero for negative inputs, identity for positive.
// X maps [-4, 4] -> [60, 500]; Y maps [0, 4] -> [190, 40].

const X = (v: number) => 60 + ((v + 4) / 8) * 440;
const Y = (v: number) => 190 - (v / 4) * 150;

export function ReluFigure() {
  return (
    <Figure caption="ReLU, drawn: relu(x) = max(0, x). Everything below zero is silenced; everything above passes through unchanged. The kink at zero is the branch — the smallest possible if — and it is the entire source of the network's nonlinearity.">
      <svg viewBox="0 0 560 235" className="w-full max-w-xl">
        {/* axes */}
        <line x1={40} y1={190} x2={520} y2={190} stroke="currentColor" strokeOpacity={0.3} />
        <line x1={X(0)} y1={28} x2={X(0)} y2={200} stroke="currentColor" strokeOpacity={0.3} />
        {[-4, -2, 2, 4].map((v) => (
          <text key={v} x={X(v)} y={206} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.55}>
            {v}
          </text>
        ))}
        <text x={X(0) + 10} y={206} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.55}>
          0
        </text>
        <text x={508} y={182} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.6}>
          input x
        </text>
        <text x={X(0) - 8} y={38} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.6}>
          relu(x)
        </text>

        {/* the hinge */}
        <polyline
          points={`${X(-4)},${Y(0)} ${X(0)},${Y(0)} ${X(4)},${Y(4)}`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.85}
          strokeWidth={2.5}
        />
        <circle cx={X(0)} cy={Y(0)} r={4} fill="currentColor" />

        {/* annotations */}
        <text x={X(-2.2)} y={Y(0) - 14} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.7}>
          below zero: output 0 — the unit is silent
        </text>
        <text x={X(2.8)} y={Y(1.1)} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.7}>
          above zero: passed through
        </text>
        <text x={X(2.8)} y={Y(1.1) + 13} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.7}>
          unchanged (slope 1)
        </text>
        <text x={X(0) + 26} y={Y(0) + 30} textAnchor="start" fontSize={10} fill="currentColor" opacity={0.6}>
          the branch
        </text>
      </svg>
    </Figure>
  );
}
