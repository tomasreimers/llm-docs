'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// The induction head circuit, walked through on a concrete sequence.
// The context repeats a (tokenized) name; the circuit finds the earlier
// occurrence and copies what followed it.
const TOKENS = ['When', 'Mr', 'Dur', 'sley', 'woke', 'up', ',', 'Mr', 'Dur'];
const PREV_DUR = 2; // earlier 'Dur'
const SLEY = 3; // what followed it
const LAST = TOKENS.length - 1; // current 'Dur'

const CW = 60;
const X0 = 24;
const Y = 96;
const BH = 34;

const PHASE_MS = 3800;
const STEP_TEXT = [
  "the model sits at the final 'Dur', predicting the next token — 'Dursley' split into 'Dur'+'sley' by the tokenizer",
  "head 1, a previous-token head: each token's vector gets tagged with the token before it — 'sley' now carries 'I follow Dur'",
  "head 2, the induction head: the current 'Dur' searches the context for a token tagged 'I follow Dur' — and attends to 'sley'",
  "copy what it finds: predict 'sley'. The circuit implements a fuzzy grep — find the last occurrence, repeat what followed",
];
const N = STEP_TEXT.length;

const tx = (i: number) => X0 + i * CW + CW / 2;

export function InductionFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);

  return (
    <Figure caption="The induction head, the best-understood circuit in a transformer, run on a concrete context. Two heads in different layers compose: a previous-token head tags each token with its predecessor; the induction head then lets the current 'Dur' find the token tagged 'I follow Dur' and copy it. Net behavior: find the last time this happened and predict the same continuation.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 640 230" className="w-full max-w-xl">
          {/* tokens */}
          {TOKENS.map((t, i) => {
            const isCur = i === LAST;
            const isMatch = i === SLEY && s >= 2;
            const isPrev = i === PREV_DUR && s >= 1;
            return (
              <g key={i}>
                <rect
                  x={X0 + i * CW + 2}
                  y={Y}
                  width={CW - 6}
                  height={BH}
                  rx={4}
                  fill="currentColor"
                  fillOpacity={isCur ? 0.18 : isMatch ? 0.22 : 0.05}
                  stroke="currentColor"
                  strokeOpacity={isCur || isMatch ? 0.9 : isPrev ? 0.6 : 0.3}
                  strokeWidth={isCur || isMatch ? 1.8 : 1}
                  style={{ transition: 'fill-opacity 400ms, stroke-opacity 400ms' }}
                />
                <text x={tx(i)} y={Y + BH / 2 + 4} textAnchor="middle" fontSize={11.5} fill="currentColor">
                  {t}
                </text>
              </g>
            );
          })}

          {/* prediction slot */}
          <g opacity={s === 3 ? 1 : 0.25} style={{ transition: 'opacity 400ms' }}>
            <rect
              x={X0 + TOKENS.length * CW + 4}
              y={Y}
              width={CW - 6}
              height={BH}
              rx={4}
              fill="currentColor"
              fillOpacity={s === 3 ? 0.3 : 0}
              stroke="currentColor"
              strokeOpacity={0.8}
              strokeDasharray={s === 3 ? undefined : '4 4'}
            />
            <text x={X0 + TOKENS.length * CW + 4 + (CW - 6) / 2} y={Y + BH / 2 + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor">
              {s === 3 ? 'sley' : '?'}
            </text>
          </g>

          {/* step 1: previous-token tags (arcs below, each token → predecessor) */}
          <g opacity={s === 1 ? 1 : s >= 2 ? 0.25 : 0} style={{ transition: 'opacity 400ms' }}>
            {TOKENS.map((_, i) => {
              if (i === 0) return null;
              const x1 = tx(i);
              const x2 = tx(i - 1);
              const emph = i === SLEY;
              return (
                <path
                  key={i}
                  d={`M ${x1} ${Y + BH + 4} C ${x1} ${Y + BH + 30}, ${x2} ${Y + BH + 30}, ${x2} ${Y + BH + 4}`}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={emph ? 0.9 : 0.3}
                  strokeWidth={emph ? 2 : 1.2}
                />
              );
            })}
            <text x={tx(SLEY) - CW / 2} y={Y + BH + 46} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>
              &apos;sley&apos; tagged: I follow &apos;Dur&apos;
            </text>
          </g>

          {/* step 2-3: induction arc above, from current Dur to sley */}
          <g opacity={s >= 2 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <path
              d={`M ${tx(LAST)} ${Y - 6} C ${tx(LAST)} ${Y - 62}, ${tx(SLEY)} ${Y - 62}, ${tx(SLEY)} ${Y - 6}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.85}
              strokeWidth={2}
            />
            <text
              x={(tx(LAST) + tx(SLEY)) / 2}
              y={Y - 56}
              textAnchor="middle"
              fontSize={10}
              fill="currentColor"
              opacity={s === 2 ? 0.75 : 0}
              style={{ transition: 'opacity 400ms' }}
            >
              attend to the token tagged &apos;I follow Dur&apos;
            </text>
          </g>

          {/* step 3: copy arrow to prediction */}
          <g opacity={s === 3 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <path
              d={`M ${tx(SLEY)} ${Y - 6} C ${tx(SLEY)} ${Y - 86}, ${X0 + TOKENS.length * CW + 30} ${Y - 86}, ${X0 + TOKENS.length * CW + 30} ${Y - 6}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.5}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            <text x={(tx(SLEY) + X0 + TOKENS.length * CW + 30) / 2} y={Y - 80} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>
              copy
            </text>
          </g>
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
