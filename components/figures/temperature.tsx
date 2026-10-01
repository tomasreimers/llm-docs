'use client';

import { useState } from 'react';

import { Figure, ink } from './figure';

const BASE: Array<[string, number]> = [
  [' Paris', 0.62],
  [' the', 0.1],
  [' a', 0.06],
  [' located', 0.05],
  [' known', 0.04],
  [' one', 0.03],
  [' famous', 0.025],
  [' home', 0.02],
  [' often', 0.015],
  [' Lyon', 0.01],
];

const LOGITS = BASE.map(([, p]) => Math.log(p));

export function TemperatureFigure() {
  const [temp, setTemp] = useState(1.0);
  const [topP, setTopP] = useState(0.95);

  const exps = LOGITS.map((l) => Math.exp(l / temp));
  const sum = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map((e) => e / sum);

  // nucleus: tokens are already sorted desc at T=1 and stay sorted for any T
  let cum = 0;
  const included = probs.map((p) => {
    const inside = cum < topP;
    cum += p;
    return inside;
  });

  return (
    <Figure caption={'The distribution for "The capital of France is", reshaped live. Lower the temperature and mass collapses onto the favorite; raise it and the tail wakes up. Grayed bars fall outside the top-p nucleus and can never be sampled.'}>
      <div className="w-full max-w-xl rounded-lg border border-neutral-200/70 p-4 dark:border-neutral-100/10">
        <div className="mb-4 grid grid-cols-2 gap-4 text-xs">
          <label className="block">
            <span className="mb-1 block opacity-70">
              temperature: <b>{temp.toFixed(2)}</b>
            </span>
            <input
              type="range"
              min={0.1}
              max={2}
              step={0.05}
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full"
            />
          </label>
          <label className="block">
            <span className="mb-1 block opacity-70">
              top-p: <b>{topP.toFixed(2)}</b>
            </span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={topP}
              onChange={(e) => setTopP(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
        <div className="flex h-44 items-end justify-between gap-1.5">
          {BASE.map(([tok], i) => (
            <div key={tok} className="flex h-full grow flex-col items-center justify-end">
              <span className="mb-1 text-[10px] tabular-nums opacity-60">
                {(probs[i] * 100).toFixed(probs[i] >= 0.1 ? 0 : 1)}%
              </span>
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: `${Math.max(probs[i] * 100, 0.5)}%`,
                  background: included[i] ? ink(80) : ink(22),
                }}
              />
              <span className="mt-1.5 whitespace-pre font-mono text-[10px] opacity-80">
                {tok}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Figure>
  );
}
