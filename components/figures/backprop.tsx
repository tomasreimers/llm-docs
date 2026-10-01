'use client';

import { useEffect, useState } from 'react';

import { Figure } from './figure';

// A two-weight network, with concrete numbers:
//   x = 2, w₁ = 0.5  →  h = 1;  w₂ = 3  →  y = 3;  target = 1  →  L = 4
// Backward: ∂L/∂y = 4;  ∂L/∂w₂ = 4;  ∂L/∂h = 12;  ∂L/∂w₁ = 24
const PHASE_MS = 1900;
const N_STEPS = 6;

const STEP_TEXT = [
  'forward: h = w₁ · x = 0.5 × 2 = 1',
  'forward: y = w₂ · h = 3 × 1 = 3',
  'forward: L = (y − target)² = (3 − 1)² = 4',
  'backward: ∂L/∂y = 2 · (y − target) = 4',
  'backward: ∂L/∂w₂ = ∂L/∂y · h = 4 · 1 = 4, and ∂L/∂h = ∂L/∂y · w₂ = 4 · 3 = 12',
  'backward: ∂L/∂w₁ = ∂L/∂h · x = 12 × 2 = 24 — the product of every local derivative on the path',
];

const NODES = [
  { id: 'x', x: 70, name: 'x', value: '2', from: -1 },
  { id: 'h', x: 210, name: 'h', value: '1', from: 0 },
  { id: 'y', x: 350, name: 'y', value: '3', from: 1 },
  { id: 'L', x: 490, name: 'L', value: '4', from: 2 },
];

const CY = 62;
const R = 20;

export function BackpropFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setTick((t) => (t + 1) % (N_STEPS + 2)),
      PHASE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N_STEPS - 1);

  const grads: Array<{ x: number; text: string; step: number }> = [
    { x: 350, text: '∂L/∂y = 4', step: 3 },
    { x: 280, text: '∂L/∂w₂ = 4', step: 4 },
    { x: 210, text: '∂L/∂h = 12', step: 4 },
    { x: 140, text: '∂L/∂w₁ = 24', step: 5 },
  ];

  return (
    <Figure caption="Backpropagation on a two-weight network, one calculation per step. Forward: compute and remember h, y, and L. Backward: walk from the loss toward the input, multiplying local derivatives — each weight's gradient is the product of everything on the path between it and the loss.">
      <div className="flex w-full flex-col items-center">
        <svg viewBox="0 0 560 160" className="w-full max-w-xl">
          <defs>
            <marker id="bp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.65} />
            </marker>
          </defs>

          {/* edges with weight labels */}
          {NODES.slice(0, -1).map((n, i) => {
            const next = NODES[i + 1];
            const active = s === i;
            return (
              <g key={n.id}>
                <line
                  x1={n.x + R}
                  y1={CY}
                  x2={next.x - R - 2}
                  y2={CY}
                  stroke="currentColor"
                  strokeOpacity={active ? 0.9 : 0.35}
                  strokeWidth={active ? 2 : 1.5}
                  markerEnd="url(#bp-arrow)"
                />
                <text x={(n.x + next.x) / 2} y={CY - 12} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.75}>
                  {i === 0 ? 'w₁ = 0.5' : i === 1 ? 'w₂ = 3' : 'target = 1'}
                </text>
              </g>
            );
          })}

          {/* nodes with values appearing as the forward pass reaches them */}
          {NODES.map((n) => {
            const computed = n.from < 0 || s >= n.from;
            const active = s === n.from;
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={CY}
                  r={R}
                  fill="currentColor"
                  fillOpacity={active ? 0.12 : 0.04}
                  stroke="currentColor"
                  strokeOpacity={computed ? 0.8 : 0.3}
                  strokeWidth={active ? 2 : 1.5}
                />
                <text x={n.x} y={CY - 4} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.75}>
                  {n.name}
                </text>
                <text x={n.x} y={CY + 11} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor" opacity={computed ? 0.95 : 0}>
                  {n.value}
                </text>
              </g>
            );
          })}

          {/* backward arrows and gradients */}
          {s >= 3 &&
            NODES.slice(0, 3).map((n, i) => {
              const visible = s >= 5 - i; // h→x needs step 5, y→h step 4, L→y step 3
              if (!visible) return null;
              const next = NODES[i + 1];
              return (
                <line
                  key={n.id}
                  x1={next.x - R}
                  y1={CY + 34}
                  x2={n.x + R}
                  y2={CY + 34}
                  stroke="currentColor"
                  strokeOpacity={0.5}
                  strokeDasharray="5 4"
                  markerEnd="url(#bp-arrow)"
                />
              );
            })}
          {grads.map((g) => {
            if (s < g.step) return null;
            const active = s === g.step;
            return (
              <text key={g.text} x={g.x} y={CY + 58} textAnchor="middle" fontSize={10.5} fontWeight={active ? 700 : 400} fill="currentColor" opacity={active ? 0.95 : 0.6}>
                {g.text}
              </text>
            );
          })}
        </svg>

        {/* the calculation at this step */}
        <div className="mt-1 flex h-5 items-center justify-center font-mono text-[11.5px] opacity-80">
          {STEP_TEXT[s]}
        </div>

        {/* stepper */}
        <div className="mt-2 flex w-full max-w-xl items-center justify-center gap-1.5">
          {STEP_TEXT.map((_, i) => (
            <button
              key={i}
              aria-label={`Jump to step ${i + 1}`}
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
