'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// Naive vs continuous batching over a grid of batch slots × token steps.
// Request lengths are fixed; occupancy numbers are computed from them.
const STEPS = 12;
const SLOTS = 4;

// naive: four requests enter together; batch ends when the longest ends
const NAIVE = [4, 12, 6, 3]; // lengths of A, B, C, D

// continuous: same four requests, but finished slots immediately refill
// slot 0: A(4) then E(6) → full through step 10, free 11-12
// slot 1: B(12)
// slot 2: C(6) then G(5) → free 12
// slot 3: D(3) then F(8) → free 12
const CONT: Array<Array<{ name: string; from: number; to: number }>> = [
  [
    { name: 'A', from: 1, to: 4 },
    { name: 'E', from: 5, to: 10 },
  ],
  [{ name: 'B', from: 1, to: 12 }],
  [
    { name: 'C', from: 1, to: 6 },
    { name: 'G', from: 7, to: 11 },
  ],
  [
    { name: 'D', from: 1, to: 3 },
    { name: 'F', from: 4, to: 11 },
  ],
];

const CW = 34;
const RH = 30;
const X0 = 70;
const Y0 = 40;

const naiveUsed = NAIVE.reduce((a, b) => a + b, 0);
const contUsed = CONT.flat().reduce((a, r) => a + (r.to - r.from + 1), 0);
const total = STEPS * SLOTS;

const PHASE_MS = 4200;
const STEP_TEXT = [
  `naive batching: four requests enter together, and the batch holds until the longest finishes — ${naiveUsed} of ${total} slot-steps do work (${Math.round((naiveUsed / total) * 100)}%)`,
  `continuous batching: the scheduler runs per token-step — the moment A finishes, E takes its slot. ${contUsed} of ${total} slot-steps work (${Math.round((contUsed / total) * 100)}%)`,
  'same hardware, same requests — the quantum of scheduling is one forward pass, and the batch never travels with empty seats',
];
const N = STEP_TEXT.length;

export function ContinuousBatchingFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);
  const continuous = s >= 1;

  const cell = (slot: number, step: number): { label: string; state: 'work' | 'dead' } | null => {
    if (!continuous) {
      const len = NAIVE[slot];
      if (step <= len) return { label: 'ABCD'[slot], state: 'work' };
      return { label: '', state: 'dead' };
    }
    for (const r of CONT[slot]) {
      if (step >= r.from && step <= r.to) return { label: r.name, state: 'work' };
    }
    return { label: '', state: 'dead' };
  };

  return (
    <Figure caption="Continuous batching, with the occupancy computed from the drawn requests: naive batching holds all four slots until the longest request finishes (52% of slot-steps do useful work); scheduling at the granularity of a single token step refills each slot the moment it frees (92%). Every empty cell is a full read of the weights that produced nothing.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 560 190" className="w-full max-w-xl">
          {/* axes */}
          {Array.from({ length: SLOTS }, (_, r) => (
            <text key={r} x={X0 - 10} y={Y0 + r * RH + RH / 2 + 4} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.6}>
              slot {r + 1}
            </text>
          ))}
          <text x={X0 + (STEPS * CW) / 2} y={Y0 + SLOTS * RH + 26} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>
            token steps →
          </text>
          {/* cells */}
          {Array.from({ length: SLOTS }, (_, r) =>
            Array.from({ length: STEPS }, (_, c) => {
              const v = cell(r, c + 1);
              if (!v) return null;
              return (
                <g key={`${r}-${c}`}>
                  <rect
                    x={X0 + c * CW + 1}
                    y={Y0 + r * RH + 2}
                    width={CW - 3}
                    height={RH - 5}
                    rx={2}
                    fill="currentColor"
                    fillOpacity={v.state === 'work' ? 0.2 : 0.03}
                    stroke="currentColor"
                    strokeOpacity={v.state === 'work' ? 0.5 : 0.15}
                    style={{ transition: 'fill-opacity 400ms, stroke-opacity 400ms' }}
                  />
                  <text
                    x={X0 + c * CW + CW / 2}
                    y={Y0 + r * RH + RH / 2 + 3.5}
                    textAnchor="middle"
                    fontSize={10}
                    fill="currentColor"
                    opacity={v.state === 'work' ? 0.85 : 0.2}
                    style={{ transition: 'opacity 400ms' }}
                  >
                    {v.label || '·'}
                  </text>
                </g>
              );
            }),
          )}
        </svg>

        <div className="flex h-12 max-w-xl items-center justify-center text-center leading-tight opacity-80">
          {STEP_TEXT[s]}
        </div>

        <div className="flex w-full max-w-xl items-center justify-center gap-1.5">
          {STEP_TEXT.map((_, i) => (
            <button
              key={i}
              aria-label={`Jump to step ${i + 1}`}
              onClick={() => setTick(i)}
              className="h-1.5 w-7 overflow-hidden rounded-full"
              style={{ background: ink(15) }}
            >
              <div
                key={`${i}-${i === s ? s : 'static'}`}
                className="h-full rounded-full"
                style={{
                  background: 'currentColor',
                  opacity: 0.65,
                  width: i < s ? '100%' : i > s ? '0%' : undefined,
                  animation: i === s ? `gd-fill ${PHASE_MS}ms linear forwards` : undefined,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </Figure>
  );
}
