'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// Two tokens routed through an 8-expert MoE layer, top-2 routing.
// Router scores are softmaxed from fixed logits in-component; the two
// winners' weights are renormalized over the top-2 (standard practice).
const TOKENS: Array<{ text: string; logits: number[] }> = [
  { text: 'the', logits: [1.2, 0.3, 2.1, -0.5, 0.8, -1.0, 1.9, 0.1] },
  { text: 'cat', logits: [0.2, 2.3, -0.4, 0.9, 1.8, 0.1, -0.7, 0.5] },
];

function softmax(z: number[]) {
  const m = Math.max(...z);
  const e = z.map((v) => Math.exp(v - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

function top2(z: number[]): [number, number] {
  const idx = z.map((_, i) => i).sort((a, b) => z[b] - z[a]);
  return [idx[0], idx[1]];
}

const EX = 440; // expert column x
const EY = (i: number) => 24 + i * 33;

const PHASE_MS = 3600;
const STEP_TEXT = [
  "token 'the' arrives at the MoE layer and hits the router first",
  'the router — a tiny linear layer plus softmax — scores all 8 experts',
  'only the top 2 run; the other 6 sit idle: their weights exist but cost nothing',
  "output: the 2 experts' results, blended by router weight. Next token, different experts — 'cat' picks its own 2",
];
const N = STEP_TEXT.length;

export function MoeFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);
  const tok = TOKENS[s === 3 ? 1 : 0];
  const probs = softmax(tok.logits);
  const [a, b] = top2(tok.logits);
  const wa = probs[a] / (probs[a] + probs[b]);
  const wb = probs[b] / (probs[a] + probs[b]);

  return (
    <Figure caption="Mixture of experts, top-2 routing: a learned router (a small linear layer plus softmax) scores all experts and sends each token to its best two. All 8 MLPs' parameters exist — that's total parameters, what the model knows — but each token only pays for 2: active parameters. Router scores shown are real softmax outputs of the illustrated logits.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 640 290" className="w-full max-w-xl">
          {/* token */}
          <rect x={20} y={125} width={100} height={38} rx={5} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeOpacity={0.6} />
          <text x={70} y={148} textAnchor="middle" fontSize={13} fill="currentColor">
            &apos;{tok.text}&apos;
          </text>
          <line x1={120} y1={144} x2={192} y2={144} stroke="currentColor" strokeOpacity={s >= 0 ? 0.6 : 0.2} markerEnd="url(#moe-arrow)" />

          <defs>
            <marker id="moe-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.6} />
            </marker>
          </defs>

          {/* router */}
          <polygon
            points="258,106 324,144 258,182 192,144"
            fill="currentColor"
            fillOpacity={s >= 1 ? 0.1 : 0.04}
            stroke="currentColor"
            strokeOpacity={0.7}
          />
          <text x={258} y={149} textAnchor="middle" fontSize={13} fill="currentColor">
            router
          </text>

          {/* experts */}
          {tok.logits.map((_, i) => {
            const active = s >= 2 && (i === a || i === b);
            const scored = s >= 1;
            return (
              <g key={i}>
                <line
                  x1={324}
                  y1={144}
                  x2={EX}
                  y2={EY(i) + 12}
                  stroke="currentColor"
                  strokeOpacity={active ? 0.85 : scored ? 0.18 : 0.08}
                  strokeWidth={active ? 2 : 1}
                  style={{ transition: 'stroke-opacity 400ms' }}
                />
                <rect
                  x={EX}
                  y={EY(i)}
                  width={120}
                  height={25}
                  rx={4}
                  fill="currentColor"
                  fillOpacity={active ? 0.14 : 0}
                  stroke="currentColor"
                  strokeOpacity={active ? 0.9 : 0.3}
                  style={{ transition: 'fill-opacity 400ms, stroke-opacity 400ms' }}
                />
                <text x={EX + 60} y={EY(i) + 16} textAnchor="middle" fontSize={11} fill="currentColor" opacity={active ? 1 : 0.45}>
                  expert {i + 1} (MLP)
                </text>
                {/* router score */}
                <text
                  x={EX - 10}
                  y={EY(i) + 16}
                  textAnchor="end"
                  fontSize={10}
                  fill="currentColor"
                  opacity={scored ? (active ? 0.9 : 0.4) : 0}
                  style={{ transition: 'opacity 400ms' }}
                >
                  {probs[i].toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* blended output */}
          <g opacity={s >= 2 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <line x1={EX + 120} y1={EY(a) + 12} x2={588} y2={136} stroke="currentColor" strokeOpacity={0.6} />
            <line x1={EX + 120} y1={EY(b) + 12} x2={588} y2={152} stroke="currentColor" strokeOpacity={0.6} />
            <text x={EX + 128} y={EY(a) + (EY(a) < 140 ? 6 : 26)} fontSize={10} fill="currentColor" opacity={0.8}>
              ×{wa.toFixed(2)}
            </text>
            <text x={EX + 128} y={EY(b) + (EY(b) < 140 ? 6 : 26)} fontSize={10} fill="currentColor" opacity={0.8}>
              ×{wb.toFixed(2)}
            </text>
            <rect x={588} y={126} width={48} height={36} rx={5} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeOpacity={0.6} />
            <text x={612} y={148} textAnchor="middle" fontSize={11} fill="currentColor">
              out
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
