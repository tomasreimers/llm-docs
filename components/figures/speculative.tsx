'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// Speculative decoding on a concrete continuation. The draft model races
// ahead four tokens; the target model verifies all four in one forward
// pass, accepts the agreeing prefix, and supplies its own token at the
// first disagreement.
// context: "The largest planet in the Solar System is"
const DRAFT = [' Jupiter', ',', ' which', ' orbits'];
const TARGET = [' Jupiter', ',', ' which', ' is'];
const MISMATCH = 3; // index where they disagree

const PHASE_MS = 4200;
const STEP_TEXT = [
  'a small, fast draft model races ahead and proposes four tokens — cheap, but not to be trusted',
  "the big model checks all four in ONE forward pass — verifying a sequence is a parallel, prefill-like job (that asymmetry is the whole trick)",
  "accept the agreeing prefix; at the first mismatch, the big model's own token takes over: four tokens committed for one full weight-read",
  'a careful accept/reject rule makes the output distribution provably identical to the big model running alone — a pure speedup',
];
const N = STEP_TEXT.length;

const CW = 86;
const X0 = 100;

export function SpeculativeFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);

  return (
    <Figure caption="Speculative decoding: the draft model proposes, the target model verifies the whole proposal in a single parallel pass (checking is prefill-shaped, generating is decode-shaped), and the agreeing prefix is committed along with the target's own token at the first disagreement. Here, one read of the big weights yields four tokens — arithmetic intensity, raised again.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 560 215" className="w-full max-w-xl">
          {/* context */}
          <text x={4} y={40} textAnchor="start" fontSize={10.5} fill="currentColor" opacity={0.7}>
            …Solar System is
          </text>

          {/* draft row */}
          <text x={X0 - 12} y={84} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.6}>
            draft (1B):
          </text>
          {DRAFT.map((t, i) => (
            <g key={i} opacity={s >= 0 ? 1 : 0}>
              <rect
                x={X0 + i * CW}
                y={64}
                width={CW - 8}
                height={30}
                rx={4}
                fill="currentColor"
                fillOpacity={s >= 2 && i < MISMATCH ? 0.18 : 0.05}
                stroke="currentColor"
                strokeOpacity={s >= 2 && i === MISMATCH ? 0.3 : 0.55}
                strokeDasharray="5 4"
                style={{ transition: 'fill-opacity 400ms, stroke-opacity 400ms' }}
              />
              <text
                x={X0 + i * CW + (CW - 8) / 2}
                y={83}
                textAnchor="middle"
                fontSize={11}
                fill="currentColor"
                opacity={s >= 2 && i === MISMATCH ? 0.35 : 0.9}
                style={{ transition: 'opacity 400ms' }}
              >
                {t}
              </text>
              {/* verdicts */}
              <text
                x={X0 + i * CW + (CW - 8) / 2}
                y={56}
                textAnchor="middle"
                fontSize={12}
                fill="currentColor"
                opacity={s >= 1 ? 0.85 : 0}
                style={{ transition: 'opacity 400ms' }}
              >
                {i < MISMATCH ? '✓' : '✗'}
              </text>
            </g>
          ))}

          {/* target row */}
          <text x={X0 - 12} y={148} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.6}>
            target (70B):
          </text>
          {TARGET.map((t, i) => (
            <g key={i} opacity={s >= 1 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
              <rect
                x={X0 + i * CW}
                y={128}
                width={CW - 8}
                height={30}
                rx={4}
                fill="currentColor"
                fillOpacity={s >= 2 && i === MISMATCH ? 0.25 : 0.08}
                stroke="currentColor"
                strokeOpacity={s >= 2 && i === MISMATCH ? 0.9 : 0.4}
                strokeWidth={s >= 2 && i === MISMATCH ? 1.6 : 1}
                style={{ transition: 'all 400ms' }}
              />
              <text x={X0 + i * CW + (CW - 8) / 2} y={147} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.9}>
                {t}
              </text>
            </g>
          ))}
          <text x={X0 + 4 * CW + 2} y={147} fontSize={10} fill="currentColor" opacity={s >= 1 ? 0.6 : 0} style={{ transition: 'opacity 400ms' }}>
            ← one pass
          </text>

          {/* committed row */}
          <g opacity={s >= 2 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <text x={X0 - 12} y={198} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.6}>
              committed:
            </text>
            {[...DRAFT.slice(0, MISMATCH), TARGET[MISMATCH]].map((t, i) => (
              <g key={i}>
                <rect
                  x={X0 + i * CW}
                  y={178}
                  width={CW - 8}
                  height={30}
                  rx={4}
                  fill="currentColor"
                  fillOpacity={0.2}
                  stroke="currentColor"
                  strokeOpacity={0.7}
                />
                <text x={X0 + i * CW + (CW - 8) / 2} y={197} textAnchor="middle" fontSize={11} fill="currentColor">
                  {t}
                </text>
              </g>
            ))}
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
