import { ACCENT, Figure } from './figure';

// A 1-D loss landscape: one smooth bowl.
const f = (x: number) => 0.09 * (x - 5) ** 2 + 1.5;
const df = (x: number) => 0.18 * (x - 5);

// x: 0.5..9.5 → px 60..530; y: loss 1.3..3.6 → px 268..30
const X = (x: number) => 60 + ((x - 0.5) / 9) * 470;
const Y = (l: number) => 268 - ((l - 1.3) / 2.3) * 238;

const CURVE = Array.from({ length: 121 }, (_, i) => {
  const x = 0.5 + (i / 120) * 9;
  return `${i === 0 ? 'M' : 'L'} ${X(x).toFixed(1)} ${Y(f(x)).toFixed(1)}`;
}).join(' ');

// Real gradient descent, lr = 3, from a random-ish init on the left slope.
const STEPS: number[] = [1.2];
for (let i = 0; i < 8; i++) {
  STEPS.push(STEPS[STEPS.length - 1] - 3 * df(STEPS[STEPS.length - 1]));
}

export function GradientDescentFigure() {
  const x0 = STEPS[0];
  const slope = df(x0);
  // tangent direction at the start point, in svg px space: stepping left by
  // gx pixels changes loss by slope * (gx in x-units), which is -gy pixels
  const gx = 40;
  const gy = ((slope * 238) / 2.3) * ((gx * 9) / 470);

  return (
    <Figure caption="Gradient descent on a 1-D loss landscape. At any point, the gradient is the local slope; step against it and repeat. The steps shown are real iterates — note how they shrink as the slope flattens near the minimum.">
      <svg viewBox="0 0 590 320" className="w-full max-w-xl">
        <defs>
          <marker id="gd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT.orange} />
          </marker>
        </defs>
        <line x1={60} y1={268} x2={530} y2={268} stroke="currentColor" strokeOpacity={0.3} />
        <line x1={60} y1={268} x2={60} y2={30} stroke="currentColor" strokeOpacity={0.3} />
        <text x={295} y={295} textAnchor="middle" fontSize={12.5} fill="currentColor" opacity={0.8}>
          a parameter θ (one of 400,000)
        </text>
        <text x={30} y={149} textAnchor="middle" fontSize={12.5} fill="currentColor" opacity={0.8} transform="rotate(-90 30 149)">
          loss
        </text>
        <path d={CURVE} fill="none" stroke="currentColor" strokeWidth={2} strokeOpacity={0.55} />
        {/* gradient arrow (uphill) at the start */}
        <line
          x1={X(x0)}
          y1={Y(f(x0))}
          x2={X(x0) - gx}
          y2={Y(f(x0)) + gy}
          stroke={ACCENT.orange}
          strokeWidth={2}
          markerEnd="url(#gd-arrow)"
        />
        <text x={X(x0) - 8} y={Y(f(x0)) - 26} textAnchor="end" fontSize={11.5} fill={ACCENT.orange}>
          gradient (points uphill)
        </text>
        {/* descent path */}
        {STEPS.slice(0, -1).map((x, i) => (
          <line
            key={i}
            x1={X(x)}
            y1={Y(f(x))}
            x2={X(STEPS[i + 1])}
            y2={Y(f(STEPS[i + 1]))}
            stroke={ACCENT.blue}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        ))}
        {STEPS.map((x, i) => (
          <circle key={i} cx={X(x)} cy={Y(f(x))} r={i === 0 ? 6 : 4.5} fill={ACCENT.blue} fillOpacity={0.4 + (0.6 * i) / (STEPS.length - 1)} />
        ))}
        <text x={X(STEPS[0])} y={Y(f(STEPS[0])) + 24} textAnchor="middle" fontSize={11.5} fill={ACCENT.blue}>
          start (random init)
        </text>
        <text x={X(STEPS[STEPS.length - 1]) + 4} y={Y(f(STEPS[STEPS.length - 1])) + 24} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          minimum
        </text>
        <text x={X(3.4)} y={Y(f(3.4)) - 32} fontSize={11.5} fill={ACCENT.blue}>
          θ ← θ − η · slope
        </text>
      </svg>
    </Figure>
  );
}
