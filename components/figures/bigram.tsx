'use client';

import { useMemo, useState } from 'react';

import { Figure, ink } from './figure';

// A real bigram model: counts from the corpus below, nothing more.
const CORPUS =
  'the cat sat on the mat . the dog sat on the rug . the cat ate the fish . ' +
  'the dog ate the bone . a cat and a dog sat on the mat . the fish was on ' +
  'the mat . a dog was on the rug . the cat was on the mat .';

const TOKENS = CORPUS.split(' ');

function buildCounts() {
  const counts = new Map<string, Map<string, number>>();
  // '.' doubles as the start-of-sentence context
  let prev = '.';
  for (const tok of TOKENS) {
    if (!counts.has(prev)) counts.set(prev, new Map());
    const row = counts.get(prev)!;
    row.set(tok, (row.get(tok) || 0) + 1);
    prev = tok;
  }
  return counts;
}

const COUNTS = buildCounts();
const CONTEXTS = ['the', 'a', 'cat', 'dog', 'sat', 'on', 'was', 'ate', '.'];

function sample(row: Map<string, number>) {
  const total = Array.from(row.values()).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [tok, c] of Array.from(row.entries())) {
    r -= c;
    if (r <= 0) return tok;
  }
  return Array.from(row.keys())[0];
}

function generate() {
  let prev = '.';
  const out: string[] = [];
  for (let i = 0; i < 25; i++) {
    const row = COUNTS.get(prev);
    if (!row) break;
    const tok = sample(row);
    out.push(tok);
    if (tok === '.' && out.length > 8) break;
    prev = tok;
  }
  return out.join(' ');
}

export function BigramFigure() {
  const [ctx, setCtx] = useState('the');
  const [sampleText, setSampleText] = useState(
    'the cat sat on the rug . ',
  );

  const rows = useMemo(() => {
    const row = COUNTS.get(ctx) || new Map<string, number>();
    const total = Array.from(row.values()).reduce((a, b) => a + b, 0);
    return Array.from(row.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tok, c]) => ({ tok, c, p: c / total }));
  }, [ctx]);

  return (
    <Figure caption={'A real bigram model, "trained" on the corpus shown (counting is the training). Click a context word to see its next-word distribution; generate to sample from the model. The output is locally plausible and globally meaningless — each word knows only the word before it.'}>
      <div className="flex w-full max-w-2xl flex-col items-center gap-3 font-mono text-[11px]">
        <div className="max-w-xl text-center leading-relaxed opacity-55">
          {CORPUS}
        </div>
        <div className="flex w-full flex-wrap items-start justify-center gap-8">
          <div>
            <div className="mb-1.5 flex flex-wrap gap-1">
              {CONTEXTS.map((w) => (
                <button
                  key={w}
                  onClick={() => setCtx(w)}
                  className={`rounded-sm px-1.5 py-0.5 ${w === ctx ? 'ink-chip--active' : 'ink-chip'}`}
                >
                  {w}
                </button>
              ))}
            </div>
            <div className="mb-1 opacity-60">
              after &quot;{ctx === '.' ? '. (sentence start)' : ctx}&quot;:
            </div>
            <div className="min-h-[104px]">
            {rows.map((r) => (
              <div key={r.tok} className="flex items-center gap-2">
                <span className="w-10 text-right">{r.tok}</span>
                <div className="h-3 w-28 rounded-sm" style={{ background: ink(8) }}>
                  <div className="h-3 rounded-sm" style={{ width: `${r.p * 100}%`, background: ink(60) }} />
                </div>
                <span className="opacity-60">
                  {r.c}× ({(r.p * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
            </div>
          </div>
          <div className="flex max-w-[240px] flex-col items-center gap-2">
            <button
              onClick={() => setSampleText(generate())}
              className="ink-button rounded-sm px-2 py-1"
            >
              generate a sentence
            </button>
            <div className="min-h-16 text-center italic leading-relaxed opacity-80">
              {sampleText}
            </div>
          </div>
        </div>
      </div>
    </Figure>
  );
}
