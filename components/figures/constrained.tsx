'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// Constrained decoding at one step. We're emitting JSON for a schema where
// "name" must be a string; the text so far is {"name": — the model's top
// candidates include illegal continuations, which the grammar masks before
// sampling. Probabilities are real softmax outputs of the shown logits,
// and the renormalization is computed, not drawn.
const CANDS: Array<{ tok: string; logit: number; legal: boolean }> = [
  { tok: '"get_weather"', logit: 2.4, legal: true },
  { tok: 'get_weather', logit: 1.6, legal: false },
  { tok: '42', logit: 0.6, legal: false },
  { tok: 'null', logit: 0.3, legal: false },
  { tok: '"fetch_data"', logit: 0.1, legal: true },
];

function softmax(items: Array<{ logit: number }>, mask?: boolean[]) {
  const vals = items.map((c, i) => (mask && !mask[i] ? -Infinity : c.logit));
  const m = Math.max(...vals.filter((v) => v !== -Infinity));
  const exps = vals.map((v) => (v === -Infinity ? 0 : Math.exp(v - m)));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const RAW = softmax(CANDS);
const MASKED = softmax(CANDS, CANDS.map((c) => c.legal));

const PHASE_MS = 4200;
const STEP_TEXT = [
  'the text so far is {"name": — and the model, being a model, puts real probability on continuations that would break the JSON',
  'the grammar engine knows only a string can come next: every illegal token\u2019s logit is set to −∞ before the softmax',
  'softmax renormalizes over what remains — the model\u2019s preferences among legal tokens are preserved, and sampling proceeds',
  'malformed output is now impossible rather than unlikely: the model proposes, the grammar disposes',
];
const N = STEP_TEXT.length;

const BAR_X = 210;
const BAR_MAX = 290;
const ROW_H = 34;
const Y0 = 36;

export function ConstrainedFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);
  const probs = s >= 2 ? MASKED : RAW;

  return (
    <Figure caption={'Constrained decoding at a single step, with real softmax numbers: generating a value for "name" (schema: must be a string), the raw distribution puts 40% of its mass on continuations that would break the JSON. The grammar masks them to −∞, the softmax renormalizes over legal tokens only, and invalid output becomes impossible by construction. This is what "JSON mode" does at every step.'}>
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 560 230" className="w-full max-w-xl">
          <text x={20} y={22} fontSize={11.5} fill="currentColor" opacity={0.8}>
            {'so far: {"name": '}
            <tspan opacity={0.5}>▌</tspan>
          </text>

          {CANDS.map((c, i) => {
            const masked = s >= 1 && !c.legal;
            const p = probs[i];
            return (
              <g key={c.tok} opacity={masked && s >= 2 ? 0.3 : 1} style={{ transition: 'opacity 400ms' }}>
                <text x={BAR_X - 12} y={Y0 + i * ROW_H + 16} textAnchor="end" fontSize={11} fill="currentColor" opacity={masked ? 0.45 : 0.9}>
                  {c.tok}
                </text>
                <rect
                  x={BAR_X}
                  y={Y0 + i * ROW_H}
                  width={Math.max(p * BAR_MAX, s >= 2 && masked ? 0 : 2)}
                  height={22}
                  rx={2}
                  fill="currentColor"
                  fillOpacity={masked ? 0.1 : 0.35}
                  style={{ transition: 'width 500ms, fill-opacity 400ms' }}
                />
                <text
                  x={BAR_X + Math.max(p * BAR_MAX, 2) + 8}
                  y={Y0 + i * ROW_H + 16}
                  fontSize={10.5}
                  fill="currentColor"
                  opacity={0.75}
                  style={{ transition: 'all 500ms' }}
                >
                  {s >= 2 && masked ? '' : `${(p * 100).toFixed(0)}%`}
                </text>
                {/* mask strike */}
                {masked && s === 1 && (
                  <text x={BAR_X + Math.max(RAW[i] * BAR_MAX, 2) + 48} y={Y0 + i * ROW_H + 16} fontSize={10.5} fill="currentColor" opacity={0.7}>
                    → −∞
                  </text>
                )}
              </g>
            );
          })}
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
