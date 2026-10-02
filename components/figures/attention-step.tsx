'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// One attention lookup with real numbers, small enough to check by hand.
// d = 2; weights W_q = identity, W_k = swap, W_v = identity (learned, in
// reality — chosen here so the arithmetic is legible).
const TOKENS = ['the', 'cat', 'sat', 'it'];
const X: number[][] = [
  [0, 1],
  [2, 0],
  [1, 1],
  [0, 2],
];

const Wq: number[][] = [
  [1, 0],
  [0, 1],
];
const Wk: number[][] = [
  [0, 1],
  [1, 0],
];
// W_v = identity

const mat = (W: number[][], v: number[]) => [
  W[0][0] * v[0] + W[0][1] * v[1],
  W[1][0] * v[0] + W[1][1] * v[1],
];
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1];

const q = mat(Wq, X[3]); // the query from 'it'
const K = X.map((x) => mat(Wk, x));
const V = X; // W_v = identity
const SCORES = K.map((k) => dot(q, k));
const SCALED = SCORES.map((s) => s / Math.sqrt(2));
const EXPS = SCALED.map((s) => Math.exp(s));
const SUM = EXPS.reduce((a, b) => a + b, 0);
const W = EXPS.map((e) => e / SUM);
const OUT = [
  V.reduce((a, v, i) => a + W[i] * v[0], 0),
  V.reduce((a, v, i) => a + W[i] * v[1], 0),
];

const vec = (v: number[], d = 1) => `[${v.map((x) => (Number.isInteger(x) && d === 1 ? x : x.toFixed(d))).join(', ')}]`;

const PHASE_MS = 3600;

const STEP_TEXT = [
  'the setup: four tokens, each already an embedding (d = 2 here; thousands in a real model)',
  "project: 'it' asks a question — q = W_q·x. Every token advertises what it holds — k = W_k·x, v = W_v·x",
  'score: how relevant is each token to the query? q · k, one dot product each',
  'normalize: divide by √d, then softmax — relevances become weights that sum to 1',
  "mix: output = Σ weight · v ≈ cat's vector. 'it' now carries cat's information",
  'and this whole lookup runs for every token, in every head, in parallel',
];
const N = STEP_TEXT.length;

const cell = 'px-2 py-[1px] text-right tabular-nums';

export function AttentionStepFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);

  return (
    <Figure caption="One attention lookup, every number real (d = 2, integer weights, chosen for legible arithmetic — in a real model these are learned and thousands-dimensional). The query from 'it' matches cat's key, so the output is mostly cat's value: the pronoun resolved, by dot products.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        {/* the sentence, shaded by attention weight once weights exist */}
        <div className="flex gap-1.5">
          {TOKENS.map((t, i) =>
            i === 3 ? (
              <span key={i} className="rounded-sm px-1.5 py-0.5 font-bold" style={{ boxShadow: `inset 0 0 0 2px ${ink(80)}` }}>
                {t} →
              </span>
            ) : (
              <span key={i} className="rounded-sm px-1.5 py-0.5" style={{ background: s >= 3 ? ink(Math.min(W[i] * 100, 60)) : ink(6) }}>
                {t}
                {s >= 3 && <span className="ml-1 align-super text-[9px] opacity-70">{W[i].toFixed(2)}</span>}
              </span>
            ),
          )}
        </div>

        <table>
          <thead>
            <tr className="opacity-60">
              <th className={cell}>token</th>
              <th className={cell}>x</th>
              {s >= 1 && <th className={cell}>k</th>}
              {s >= 1 && <th className={cell}>v</th>}
              {s >= 2 && <th className={cell}>q·k</th>}
              {s >= 3 && <th className={cell}>weight</th>}
            </tr>
          </thead>
          <tbody style={{ borderTop: `1px solid ${ink(20)}` }}>
            {TOKENS.map((t, i) => (
              <tr key={i} style={{ fontWeight: i === 1 && s >= 3 ? 700 : 400 }}>
                <td className={`${cell} opacity-70`}>{t}</td>
                <td className={cell}>{vec(X[i])}</td>
                {s >= 1 && <td className={cell} style={{ fontWeight: s === 1 ? 700 : undefined }}>{vec(K[i])}</td>}
                {s >= 1 && <td className={cell}>{vec(V[i])}</td>}
                {s >= 2 && <td className={cell} style={{ fontWeight: s === 2 ? 700 : undefined }}>{SCORES[i]}</td>}
                {s >= 3 && <td className={cell} style={{ fontWeight: s === 3 ? 700 : undefined }}>{W[i].toFixed(2)}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex min-h-5 flex-col items-center justify-center gap-0.5 opacity-80">
          {s >= 1 && <div>q (from &apos;it&apos;) = {vec(q)}</div>}
          {s >= 4 && (
            <div style={{ fontWeight: s === 4 ? 700 : 400 }}>
              output = {W.map((w, i) => `${w.toFixed(2)}·${vec(V[i])}`).join(' + ')} = {vec(OUT, 2)}
            </div>
          )}
        </div>

        <div className="flex min-h-8 max-w-xl items-center justify-center text-center leading-tight opacity-80">
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
