'use client';

import { useEffect, useState } from 'react';

import { Figure } from './figure';

// Same bowl as the gradient descent figure above it.
const f = (x: number) => 0.09 * (x - 5) ** 2 + 1.5;
const df = (x: number) => 0.18 * (x - 5);

const X = (x: number) => 60 + ((x - 0.5) / 9) * 470;
const Y = (l: number) => 268 - ((l - 1.3) / 2.3) * 238;

const CURVE = Array.from({ length: 121 }, (_, i) => {
  const x = 0.5 + (i / 120) * 9;
  return `${i === 0 ? 'M' : 'L'} ${X(x).toFixed(1)} ${Y(f(x)).toFixed(1)}`;
}).join(' ');

// The thought experiment: a fixed stride in whichever direction is downhill.
const STRIDE = 1.7;
const STEPS: number[] = [1.2];
for (let i = 0; i < 5; i++) {
  const x = STEPS[STEPS.length - 1];
  STEPS.push(x - STRIDE * Math.sign(df(x)));
}
const LAST = STEPS.length - 1;

const PHASE_MS = 850;

export function FixedStepFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setTick((t) => (t + 1) % (LAST + 3)),
      PHASE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, LAST);
  const walker = STEPS[s];

  return (
    <Figure caption="The thought experiment, animated: the same stride every time, aimed downhill. Nearing the valley floor it overshoots, lands on the far slope, turns around, and overshoots again — orbiting the minimum forever.">
      <div className="flex w-full flex-col items-center">
        <svg viewBox="0 0 590 320" className="w-full max-w-xl">
        <line x1={60} y1={268} x2={530} y2={268} stroke="currentColor" strokeOpacity={0.3} />
        <line x1={60} y1={268} x2={60} y2={30} stroke="currentColor" strokeOpacity={0.3} />
        <text x={295} y={295} textAnchor="middle" fontSize={12.5} fill="currentColor" opacity={0.8}>
          a parameter θ — fixed-size steps
        </text>
        <text x={30} y={149} textAnchor="middle" fontSize={12.5} fill="currentColor" opacity={0.8} transform="rotate(-90 30 149)">
          loss
        </text>
        <path d={CURVE} fill="none" stroke="currentColor" strokeWidth={2} strokeOpacity={0.55} />

        {/* trail */}
        {STEPS.slice(0, s).map((x, i) => (
          <line
            key={i}
            x1={X(x)}
            y1={Y(f(x))}
            x2={X(STEPS[i + 1])}
            y2={Y(f(STEPS[i + 1]))}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        ))}
        {STEPS.slice(0, s + 1).map((x, i) => (
          <circle key={i} cx={X(x)} cy={Y(f(x))} r={4} fill="currentColor" fillOpacity={0.3} />
        ))}

        {/* the walker */}
        <g
          style={{
            transform: `translate(${X(walker)}px, ${Y(f(walker))}px)`,
            transition: `transform ${PHASE_MS * 0.55}ms ease-in-out`,
          }}
        >
          <circle r={6.5} fill="currentColor" />
        </g>

        <text x={X(5)} y={Y(f(5)) + 26} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>
          the minimum — never reached
        </text>
        <line x1={X(5)} y1={Y(f(5)) - 4} x2={X(5)} y2={Y(f(5)) + 14} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 3" />
        </svg>
        <div className="mt-2 flex w-full max-w-xl items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              aria-label={`Jump to iteration ${i}`}
              onClick={() => setTick(i)}
              className="h-1.5 w-7 overflow-hidden rounded-full"
              style={{ background: 'color-mix(in srgb, currentColor 15%, transparent)' }}
            >
              <div
                key={`${i}-${i === s ? s : 'static'}`}
                className="h-full rounded-full"
                style={{
                  background: 'currentColor',
                  opacity: 0.65,
                  width: i < s ? '100%' : i > s ? '0%' : undefined,
                  animation:
                    i === s ? `gd-fill ${PHASE_MS}ms linear forwards` : undefined,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </Figure>
  );
}
