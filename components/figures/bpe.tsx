'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// Real byte-pair encoding, trained live on the classic mini-corpus from the
// BPE paper. Each step merges the most frequent adjacent pair.
const WORDS: Array<[string, number]> = [
  ['low', 5],
  ['lower', 2],
  ['newest', 6],
  ['widest', 3],
];

const N_MERGES = 8;
const PHASE_MS = 2600;

type State = { words: string[][]; merge?: { pair: string; count: number } };

function train(): State[] {
  let words = WORDS.map(([w]) => w.split(''));
  const states: State[] = [{ words: words.map((w) => [...w]) }];
  for (let m = 0; m < N_MERGES; m++) {
    const pairCounts = new Map<string, number>();
    words.forEach((toks, wi) => {
      for (let i = 0; i < toks.length - 1; i++) {
        const key = `${toks[i]}\u0000${toks[i + 1]}`;
        pairCounts.set(key, (pairCounts.get(key) || 0) + WORDS[wi][1]);
      }
    });
    let best = '';
    let bestN = 0;
    for (const [k, n] of Array.from(pairCounts.entries())) {
      if (n > bestN) {
        best = k;
        bestN = n;
      }
    }
    if (!best) break;
    const [a, b] = best.split('\u0000');
    words = words.map((toks) => {
      const out: string[] = [];
      let i = 0;
      while (i < toks.length) {
        if (i < toks.length - 1 && toks[i] === a && toks[i + 1] === b) {
          out.push(a + b);
          i += 2;
        } else {
          out.push(toks[i]);
          i += 1;
        }
      }
      return out;
    });
    states.push({ words: words.map((w) => [...w]), merge: { pair: a + b, count: bestN } });
  }
  return states;
}

const STATES = train();

export function BpeFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setTick((t) => (t + 1) % (STATES.length + 1)),
      PHASE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, STATES.length - 1);
  const state = STATES[s];

  return (
    <Figure caption="Byte-pair encoding, trained live on a four-word corpus: at every step, the most frequent adjacent pair becomes a new token. Watch 'est', 'low', and 'new' — real subword units — assemble themselves out of raw characters, purely from counting.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11.5px]">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {state.words.map((toks, wi) => (
            <div key={wi} className="flex items-center gap-0.5">
              {toks.map((t, i) => (
                <span
                  key={i}
                  className="rounded-sm px-1 py-0.5"
                  style={{
                    background: ink(t.length > 1 ? 16 : 6),
                    boxShadow: state.merge && t === state.merge.pair ? `inset 0 -2px 0 ${ink(70)}` : undefined,
                    fontWeight: state.merge && t === state.merge.pair ? 700 : 400,
                  }}
                >
                  {t}
                </span>
              ))}
              <span className="ml-1 opacity-50">×{WORDS[wi][1]}</span>
            </div>
          ))}
        </div>
        <div className="flex min-h-5 items-center justify-center opacity-80">
          {s === 0
            ? 'start: every word is just characters — vocabulary: single letters'
            : `merge ${s}: '${state.merge!.pair}' (${state.merge!.count} occurrences) joins the vocabulary`}
        </div>
        <div className="flex w-full max-w-xl items-center justify-center gap-1.5">
          {STATES.map((_, i) => (
            <button
              key={i}
              aria-label={`Jump to merge ${i}`}
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
