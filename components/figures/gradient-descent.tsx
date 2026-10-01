'use client';

import { useEffect, useState } from 'react';

import { Figure } from './figure';

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
const LAST = STEPS.length - 1;

// px slope of the curve in screen space, per px of x
const slopePx = (x: number) => (df(x) * (238 / 2.3)) / (470 / 9);

const PHASE_MS = 850;
// two phases (measure slope, step) per iterate, plus a 2-phase hold at the end
const TOTAL_TICKS = LAST * 2 + 2;

function TangentArrow({ x }: { x: number }) {
  const m = slopePx(x);
  const dirx = df(x) > 0 ? 1 : -1; // uphill direction on screen
  const len = 16 + Math.min(Math.abs(df(x)) * 70, 48);
  const norm = Math.sqrt(1 + m * m);
  const dx = (dirx * len) / norm;
  const dy = (-m * dirx * len) / norm; // screen y is inverted
  return (
    <g>
      <line
        x1={X(x)}
        y1={Y(f(x))}
        x2={X(x) + dx}
        y2={Y(f(x)) + dy}
        stroke="currentColor"
        strokeOpacity={0.8}
        strokeWidth={2}
        markerEnd="url(#gd-arrow)"
      />
      <text x={X(x) + 12} y={Y(f(x)) - 16} fontSize={11} fill="currentColor" opacity={0.75}>
        slope (uphill)
      </text>
    </g>
  );
}

export function GradientDescentFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setTick((t) => (t + 1) % (TOTAL_TICKS + 1)),
      PHASE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(Math.floor(tick / 2), LAST);
  const measuring = tick % 2 === 0 && s < LAST;
  const stepping = tick % 2 === 1 && s < LAST;
  const walker = STEPS[stepping ? s + 1 : s];

  return (
    <Figure caption="Gradient descent, one iterate at a time: measure the slope at the current point (the arrow points uphill, and is longer where the slope is steeper), step the other way, repeat. The steps shrink on their own as the slope fades toward the minimum.">
      <svg viewBox="0 0 590 320" className="w-full max-w-xl">
        <defs>
          <marker id="gd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.8} />
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

        {/* trail of visited points and step segments */}
        {STEPS.slice(0, s + (stepping ? 1 : 0)).map((x, i) => (
          <line
            key={i}
            x1={X(x)}
            y1={Y(f(x))}
            x2={X(STEPS[i + 1])}
            y2={Y(f(STEPS[i + 1]))}
            stroke="currentColor"
            strokeOpacity={0.45}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        ))}
        {STEPS.slice(0, s + (stepping ? 2 : 1)).map((x, i) => (
          <circle key={i} cx={X(x)} cy={Y(f(x))} r={4} fill="currentColor" fillOpacity={0.35} />
        ))}

        {/* the derivative at the current point */}
        {measuring && <TangentArrow x={STEPS[s]} />}

        {/* the walker */}
        <g
          style={{
            transform: `translate(${X(walker)}px, ${Y(f(walker))}px)`,
            transition: `transform ${PHASE_MS * 0.55}ms ease-in-out`,
          }}
        >
          <circle r={6.5} fill="currentColor" />
        </g>

        <text x={X(STEPS[0]) + 12} y={Y(f(STEPS[0])) + 22} fontSize={11} fill="currentColor" opacity={0.7}>
          start (random init)
        </text>
        <text x={X(STEPS[LAST])} y={Y(f(STEPS[LAST])) + 26} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>
          minimum
        </text>
        <text x={X(7.6)} y={Y(f(8.6))} fontSize={11.5} fill="currentColor" opacity={0.7}>
          θ ← θ − η · slope
        </text>
      </svg>
    </Figure>
  );
}
