'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// A [2,2,1] network learning XOR, for real: h = relu(W₁x + b), ŷ = sigmoid(v·h + c),
// squared loss, plain full-batch gradient descent with lr = 2. The whole
// trajectory is computed here, so every number in the tables is genuine.
const DATA: Array<[number, number, number]> = [
  [0, 0, 0],
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 0],
];

const LR = 2;
const STEPS = 60;
const SNAPS = [0, 1, 2, 5, 10, 20, 40, 60];
const PHASE_MS = 2300;

type Params = Record<string, number>;

const INIT: Params = { w11: 0.7, w21: 0.8, b1: 0, w12: 0.9, w22: 0.8, b2: -0.4, v1: 0.6, v2: -1.2, c: 0 };

function trajectory() {
  const p: Params = { ...INIT };
  const out: Array<{ loss: number; preds: number[]; p: Params; g: Params }> = [];
  for (let s = 0; s <= STEPS; s++) {
    const g: Params = { w11: 0, w12: 0, w21: 0, w22: 0, b1: 0, b2: 0, v1: 0, v2: 0, c: 0 };
    let loss = 0;
    const preds: number[] = [];
    for (const [x1, x2, t] of DATA) {
      const z1 = p.w11 * x1 + p.w21 * x2 + p.b1;
      const z2 = p.w12 * x1 + p.w22 * x2 + p.b2;
      const h1 = Math.max(0, z1);
      const h2 = Math.max(0, z2);
      const y = 1 / (1 + Math.exp(-(p.v1 * h1 + p.v2 * h2 + p.c)));
      preds.push(y);
      loss += (y - t) ** 2 / 4;
      const dy = (2 * (y - t) * y * (1 - y)) / 4;
      g.v1 += dy * h1;
      g.v2 += dy * h2;
      g.c += dy;
      const dh1 = dy * p.v1 * (z1 > 0 ? 1 : 0);
      const dh2 = dy * p.v2 * (z2 > 0 ? 1 : 0);
      g.w11 += dh1 * x1;
      g.w21 += dh1 * x2;
      g.b1 += dh1;
      g.w12 += dh2 * x1;
      g.w22 += dh2 * x2;
      g.b2 += dh2;
    }
    out.push({ loss, preds, p: { ...p }, g: { ...g } });
    for (const k of Object.keys(g)) p[k] -= LR * g[k];
  }
  return out;
}

const TRAJ = trajectory();

const PARAM_LABELS: Array<[string, string]> = [
  ['w11', 'w₁₁'],
  ['w21', 'w₂₁'],
  ['b1', 'b₁'],
  ['w12', 'w₁₂'],
  ['w22', 'w₂₂'],
  ['b2', 'b₂'],
  ['v1', 'v₁'],
  ['v2', 'v₂'],
  ['c', 'c'],
];

const cell = 'px-2 py-0.5 text-right tabular-nums';

export function XorFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setTick((t) => (t + 1) % (SNAPS.length + 1)),
      PHASE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const si = Math.min(tick, SNAPS.length - 1);
  const step = SNAPS[si];
  const snap = TRAJ[step];

  return (
    <Figure caption="A [2, 2, 1] network learning XOR — every number is a real trajectory: plain gradient descent, learning rate 2, all four examples per step. Watch the predictions pull toward their targets as the weights drift and the gradients fade. (Raise the learning rate to 5 and this same network collapses to answering 0.5 for everything — the ricochet from earlier.)">
      <div className="flex w-full flex-col items-center">
        <div className="flex flex-wrap items-start justify-center gap-8 font-mono text-[11.5px]">
          {/* truth table with live predictions */}
          <table>
            <thead>
              <tr className="opacity-60">
                <th className={cell}>x₁</th>
                <th className={cell}>x₂</th>
                <th className={cell}>target</th>
                <th className={cell}>ŷ</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: `1px solid ${ink(20)}` }}>
              {DATA.map(([x1, x2, t], i) => {
                const y = snap.preds[i];
                const good = Math.abs(y - t) < 0.3;
                return (
                  <tr key={i}>
                    <td className={cell}>{x1}</td>
                    <td className={cell}>{x2}</td>
                    <td className={cell}>{t}</td>
                    <td className={cell} style={{ fontWeight: good ? 700 : 400, opacity: good ? 1 : 0.65 }}>
                      {y.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: `1px solid ${ink(20)}` }}>
                <td className={cell} colSpan={3}>
                  mean loss
                </td>
                <td className={`${cell} font-bold`}>{snap.loss.toFixed(3)}</td>
              </tr>
            </tbody>
          </table>

          {/* parameters and their gradients */}
          <table>
            <thead>
              <tr className="opacity-60">
                <th className={cell}>param</th>
                <th className={cell}>value</th>
                <th className={cell}>∂L/∂·</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: `1px solid ${ink(20)}` }}>
              {PARAM_LABELS.map(([k, label]) => (
                <tr key={k}>
                  <td className={`${cell} opacity-70`}>{label}</td>
                  <td className={cell}>{snap.p[k].toFixed(2)}</td>
                  <td className={`${cell} opacity-70`}>{snap.g[k] >= 0 ? '+' : ''}{snap.g[k].toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 flex min-h-5 items-center justify-center font-mono text-[11.5px] opacity-80">
          step {step} of {STEPS}
        </div>

        <div className="mt-2 flex w-full max-w-xl items-center justify-center gap-1.5">
          {SNAPS.map((n, i) => (
            <button
              key={n}
              aria-label={`Jump to step ${n}`}
              onClick={() => setTick(i)}
              className="h-1.5 w-7 overflow-hidden rounded-full"
              style={{ background: ink(15) }}
            >
              <div
                key={`${i}-${i === si ? si : 'static'}`}
                className="h-full rounded-full"
                style={{
                  background: 'currentColor',
                  opacity: 0.65,
                  width: i < si ? '100%' : i > si ? '0%' : undefined,
                  animation: i === si ? `gd-fill ${PHASE_MS}ms linear forwards` : undefined,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </Figure>
  );
}
