'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// Why single-stream decode is slow: one token step for a 70B model in
// bf16 on one H100. All numbers computed from the chapter's specs:
//   move:    140 GB / 3.35 TB/s = 41.8 ms
//   compute: 2 * 70e9 FLOPs / 989e12 FLOP/s = 0.14 ms  (0.34% of the step)
//   ceiling: 1 / 0.0418 s = ~24 tokens/sec (matches the accordion below it)

const PHASE_MS = 4200;
const STEP_TEXT = [
  'to emit one token, every weight must visit the cores: all 140 GB cross the bus, and each weight does ~2 FLOPs (one multiply-add) before being discarded',
  'the bus sets the clock: 140 GB ÷ 3.35 TB/s ≈ 42 ms for this one token — a hard floor, before compute even enters the question',
  "the cores' share of those 42 ms: 2 × 70B ≈ 140 GFLOPs ≈ 0.14 ms — busy 0.3% of the step, waiting on bytes the other 99.7%",
  'and nothing carries over: the next token re-reads the same 140 GB — a treadmill the next chapter is entirely about escaping',
];
const N = STEP_TEXT.length;

const BAR_X = 30;
const BAR_W = 510;

export function DecodeTreadmillFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);

  return (
    <Figure caption="One decode step, to scale in time: emitting a single token from a 70B model (bf16, one H100) means moving all 140 GB of weights from HBM to the cores — ~42 ms at 3.35 TB/s — while the arithmetic those bytes feed takes ~0.14 ms. The cores idle ~99.7% of every step, and the entire read repeats for every token: that division is where the ~24 tokens/sec ceiling comes from.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 600 236" className="w-full max-w-xl">
          <defs>
            <marker id="dt-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" opacity={0.7} />
            </marker>
          </defs>

          {/* HBM */}
          <text x={95} y={28} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.75}>
            HBM — weights: 140 GB
          </text>
          <rect x={30} y={36} width={130} height={110} rx={5} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.5} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={42}
              y={48 + i * 18}
              width={106}
              height={12}
              rx={2}
              fill="currentColor"
              fillOpacity={0.12}
              stroke="currentColor"
              strokeOpacity={0.25}
            />
          ))}

          {/* cores */}
          <text x={445} y={16} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.75}>
            tensor cores
          </text>
          <text x={445} y={28} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.55}>
            ~1 PFLOP/s
          </text>
          <rect x={390} y={36} width={110} height={110} rx={5} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.5} />
          {[0, 1, 2, 3].map((i) =>
            [0, 1, 2, 3].map((j) => (
              <rect
                key={`${i}-${j}`}
                x={402 + i * 22}
                y={48 + j * 22}
                width={16}
                height={16}
                rx={2}
                fill="currentColor"
                fillOpacity={s >= 2 ? 0.05 : 0.1}
                stroke="currentColor"
                strokeOpacity={0.25}
                style={{ transition: 'fill-opacity 400ms' }}
              />
            )),
          )}

          {/* bus */}
          <line x1={160} y1={91} x2={384} y2={91} stroke="currentColor" strokeOpacity={0.6} strokeWidth={1.4} markerEnd="url(#dt-arrow)" />
          <text x={272} y={78} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>
            bus: 3.35 TB/s
          </text>
          {/* packets in flight */}
          {[196, 252, 308].map((x, i) => (
            <rect
              key={i}
              x={x}
              y={84}
              width={26}
              height={14}
              rx={2}
              fill="currentColor"
              fillOpacity={s === 0 || s === 3 ? 0.3 : 0.1}
              stroke="currentColor"
              strokeOpacity={s === 0 || s === 3 ? 0.7 : 0.3}
              style={{ transition: 'all 400ms' }}
            />
          ))}
          <text
            x={272}
            y={116}
            textAnchor="middle"
            fontSize={9.5}
            fill="currentColor"
            opacity={s === 0 ? 0.65 : 0.35}
            style={{ transition: 'opacity 400ms' }}
          >
            each weight: ~2 FLOPs, then discarded
          </text>

          {/* output token */}
          <line x1={500} y1={91} x2={536} y2={91} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#dt-arrow)" />
          <text x={544} y={95} textAnchor="start" fontSize={10} fill="currentColor" opacity={0.7}>
            1 token
          </text>

          {/* time bar */}
          <g opacity={s >= 1 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <text x={BAR_X} y={172} textAnchor="start" fontSize={10} fill="currentColor" opacity={0.7}>
              one token step ≈ 42 ms
            </text>
            <text
              x={BAR_X + BAR_W}
              y={172}
              textAnchor="end"
              fontSize={10}
              fill="currentColor"
              opacity={s >= 3 ? 0.75 : 0}
              style={{ transition: 'opacity 400ms' }}
            >
              × every token
            </text>
            <rect x={BAR_X} y={178} width={BAR_W} height={18} rx={3} fill="currentColor" fillOpacity={0.07} stroke="currentColor" strokeOpacity={0.4} />
            <text x={BAR_X + BAR_W / 2} y={191} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.6}>
              cores waiting on bytes: ~41.7 ms
            </text>
          </g>

          {/* compute sliver — 0.14/41.8 of the bar is ~1.7px; drawn at 3px, still generous */}
          <g opacity={s >= 2 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <rect x={BAR_X} y={178} width={3} height={18} fill="currentColor" fillOpacity={0.9} />
            <line x1={BAR_X + 2} y1={198} x2={BAR_X + 26} y2={214} stroke="currentColor" strokeOpacity={0.45} />
            <text x={BAR_X + 30} y={219} textAnchor="start" fontSize={9.5} fill="currentColor" opacity={0.75}>
              cores busy: 0.14 ms (0.3% — drawn wider than life)
            </text>
          </g>
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
