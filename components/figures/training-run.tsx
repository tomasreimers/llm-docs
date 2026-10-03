'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// A month in the life of the run planned in Chapter 4: the 8B model on 15T
// tokens. Mechanics are illustrative; the endpoints are real — loss starts
// at ln(128,256) ≈ 11.76 (uniform over the vocabulary) and lands at ≈2.03,
// the value Chapter 4's fitted formula predicted for this plan.
const WARMUP = 0.02;
const DECAY_AT = 0.85;
const SPIKE_T = 0.45;

// control points for the loss glide (log-interpolated between them)
const PTS: Array<[number, number]> = [
  [0, 11.76],
  [0.005, 9.2],
  [0.01, 7.4],
  [0.02, 5.6],
  [0.04, 4.3],
  [0.08, 3.4],
  [0.15, 2.9],
  [0.3, 2.52],
  [0.5, 2.33],
  [0.7, 2.21],
  [0.85, 2.14],
  [0.93, 2.07],
  [1, 2.03],
];

function lossAt(t: number) {
  let i = 0;
  while (i < PTS.length - 2 && PTS[i + 1][0] < t) i++;
  const [t0, l0] = PTS[i];
  const [t1, l1] = PTS[i + 1];
  const f = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
  const base = Math.exp(Math.log(l0) + f * (Math.log(l1) - Math.log(l0)));
  // the spike: a sharp bump that recovers over ~2% of the run
  const d = t - SPIKE_T;
  const spike = d >= 0 ? 1.1 * Math.exp(-d / 0.006) : 0;
  return base + spike;
}

function lrAt(t: number) {
  if (t < WARMUP) return t / WARMUP;
  if (t < DECAY_AT) return 1;
  return 1 - ((t - DECAY_AT) / (1 - DECAY_AT)) * 0.95;
}

// layout: loss panel on top (log y), lr strip below, shared x
const X = (t: number) => 62 + t * 468;
const LY = (loss: number) => {
  const lo = Math.log(1.9);
  const hi = Math.log(12.5);
  return 40 + ((hi - Math.log(loss)) / (hi - lo)) * 160;
};
const RY = (lr: number) => 292 - lr * 52;

function pathOf(f: (t: number) => number, Y: (v: number) => number, step = 0.002) {
  const parts: string[] = [];
  for (let t = 0; t <= 1.0001; t += step) {
    parts.push(`${parts.length ? 'L' : 'M'} ${X(Math.min(t, 1)).toFixed(1)} ${Y(f(Math.min(t, 1))).toFixed(1)}`);
  }
  return parts.join(' ');
}

const PHASE_MS = 4200;
const STEP_TEXT = [
  'step zero: loss = ln(128,256) ≈ 11.8 — every token equally likely. Warmup ramps the learning rate so the violent early gradients don\u2019t wreck the initialization',
  'the cruise: ~3 weeks at full learning rate, ~720B tokens a day, loss gliding down its power law',
  'day 13: a loss spike — a bad batch or a numerical hiccup. Clip the gradients, skip the batch; worst case, rewind to a checkpoint',
  'the last 15%: decay the learning rate and the loss takes a final dive — landing at 2.03, where Chapter 4\u2019s fit said it would',
];
const N = STEP_TEXT.length;

// highlight windows per step: [t0, t1]
const WINDOWS: Array<[number, number]> = [
  [0, 0.05],
  [0.05, 0.85],
  [0.43, 0.52],
  [0.85, 1],
];

export function TrainingRunFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);
  const [w0, w1] = WINDOWS[s];

  return (
    <Figure caption="A month in the life of the run Chapter 4 planned: the 8B model, 15T tokens, 1,000 GPUs. Top: loss (log scale) — from ln(vocab) ≈ 11.8 at initialization, down the power-law glide, over one spike, to the final decay dive. Bottom: the WSD learning-rate schedule driving it. Mechanics illustrative; endpoints real.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 560 330" className="w-full max-w-xl">
          {/* highlight window */}
          <rect
            x={X(w0)}
            y={32}
            width={X(w1) - X(w0)}
            height={268}
            fill="currentColor"
            fillOpacity={0.05}
            style={{ transition: 'all 500ms' }}
          />

          {/* loss panel */}
          {[2, 4, 8, 12].map((l) => (
            <g key={l}>
              <line x1={62} y1={LY(l)} x2={530} y2={LY(l)} stroke="currentColor" strokeOpacity={0.08} />
              <text x={52} y={LY(l) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>
                {l}
              </text>
            </g>
          ))}
          <text x={26} y={120} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.75} transform="rotate(-90 26 120)">
            loss (log)
          </text>
          <path d={pathOf(lossAt, LY, 0.0015)} fill="none" stroke="currentColor" strokeOpacity={0.85} strokeWidth={2} />

          {/* annotations */}
          <g opacity={s === 0 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <circle cx={X(0)} cy={LY(11.76)} r={4} fill="currentColor" />
            <text x={X(0) + 10} y={LY(11.76) + 4} fontSize={10.5} fill="currentColor" opacity={0.85}>
              ln(128,256) ≈ 11.8
            </text>
          </g>
          <g opacity={s === 2 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <text x={X(SPIKE_T) + 8} y={LY(3.5)} fontSize={10.5} fill="currentColor" opacity={0.85}>
              spike → clip, skip, rewind
            </text>
          </g>
          <g opacity={s === 3 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <circle cx={X(1)} cy={LY(2.03)} r={4.5} fill="none" stroke="currentColor" strokeWidth={2} />
            <text x={X(1) - 10} y={LY(2.03) - 12} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.85}>
              2.03 — as predicted
            </text>
          </g>

          {/* lr strip */}
          {[0, 1].map((v) => (
            <line key={v} x1={62} y1={RY(v)} x2={530} y2={RY(v)} stroke="currentColor" strokeOpacity={0.08} />
          ))}
          <text x={26} y={266} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.75} transform="rotate(-90 26 266)">
            lr
          </text>
          <path d={pathOf(lrAt, RY, 0.004)} fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth={2} strokeDasharray="5 4" />

          <text x={296} y={322} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
            training progress — 0 to 15T tokens (~1 month)
          </text>
        </svg>

        <div className="flex h-9 max-w-xl items-center justify-center text-center leading-tight opacity-80">
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
