'use client';

import { useState } from 'react';

import { Figure, ink } from './figure';

// The same query token under three different heads. Weight patterns are
// illustrative of head types documented by interpretability work.
const TOKENS = ['the', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired'];
const QUERY = 7; // 'it'

const HEADS: Array<{ name: string; desc: string; w: number[] }> = [
  {
    name: 'a coreference head',
    desc: 'asks: what noun am I about?',
    w: [0.03, 0.58, 0.06, 0.02, 0.02, 0.08, 0.05, 0, 0.05, 0.11],
  },
  {
    name: 'a previous-token head',
    desc: 'asks: what came right before me?',
    w: [0.01, 0.02, 0.02, 0.01, 0.02, 0.04, 0.8, 0, 0.04, 0.04],
  },
  {
    name: 'a broad-context head',
    desc: 'averages a little of everything',
    w: [0.11, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11, 0, 0.11, 0.12],
  },
];

export function AttentionFigure() {
  const [h, setH] = useState(0);
  const head = HEADS[h];

  return (
    <Figure caption="The same query token under three different heads, each asking its own question of the context. Weight patterns are illustrative, but the head types are real — previous-token heads in particular are among the best-documented circuits in trained models (Chapter 6).">
      <div className="flex w-full flex-col items-center gap-2.5 font-mono text-[11.5px]">
        <div className="flex flex-wrap justify-center gap-1.5">
          {TOKENS.map((text, i) =>
            i === QUERY ? (
              <span key={i} className="rounded-sm px-1.5 py-1 font-bold" style={{ boxShadow: `inset 0 0 0 2px ${ink(80)}` }}>
                {text} →
              </span>
            ) : (
              <span key={i} className="rounded-sm px-1.5 py-1" style={{ background: ink(Math.min(head.w[i] * 100, 62)) }}>
                <span>{text}</span>
                <span className="ml-1 align-super text-[10px] opacity-70">{head.w[i].toFixed(2)}</span>
              </span>
            ),
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {HEADS.map((hd, i) => (
            <button key={hd.name} onClick={() => setH(i)} className={`rounded-sm px-1.5 py-0.5 ${i === h ? 'ink-chip--active' : 'ink-chip'}`}>
              {hd.name}
            </button>
          ))}
        </div>
        <div className="min-h-4 italic opacity-70">{head.desc}</div>
      </div>
    </Figure>
  );
}
