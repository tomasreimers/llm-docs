'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

function Box({
  x,
  y,
  w,
  label,
  sub,
  active,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub?: string;
  active: boolean;
}) {
  return (
    <g style={{ transition: 'opacity 400ms' }} opacity={active ? 1 : 0.35}>
      <rect
        x={x}
        y={y}
        width={w}
        height={46}
        rx={6}
        fill="currentColor"
        fillOpacity={active ? 0.1 : 0.02}
        stroke="currentColor"
        strokeOpacity={active ? 0.85 : 0.4}
        strokeWidth={active ? 1.5 : 1}
      />
      <text x={x + w / 2} y={y + (sub ? 20 : 28)} textAnchor="middle" fontSize={13} fill="currentColor">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + 36} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.6}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({
  d,
  label,
  lx,
  ly,
  dashed,
  active,
}: {
  d: string;
  label?: string;
  lx?: number;
  ly?: number;
  dashed?: boolean;
  active: boolean;
}) {
  return (
    <g style={{ transition: 'opacity 400ms' }} opacity={active ? 1 : 0.18}>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.7}
        strokeWidth={active ? 1.8 : 1.2}
        strokeDasharray={dashed ? '5 4' : undefined}
        markerEnd="url(#rlhf-arrow)"
      />
      {label && (
        <text x={lx} y={ly} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.75}>
          {label}
        </text>
      )}
    </g>
  );
}

const PHASE_MS = 4000;
const STEP_TEXT = [
  'SFT: train on written transcripts — the base model learns the assistant format',
  "collect judgment: the SFT model answers the same prompt twice; a human picks the better answer. Comparing is much cheaper than writing",
  'train a reward model on those picks: human judgment, compressed into a function you can call a million times an hour',
  'RL: the model generates, the reward model scores, PPO makes high-scoring behavior more likely — with a KL leash back to the start',
];
const N = STEP_TEXT.length;

export function RlhfPipelineFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);

  return (
    <Figure caption="The classical post-training pipeline: demonstrations teach the format (SFT), comparisons teach judgment (the reward model), and RL optimizes against the learned reward — with a KL leash back to where it started, because an unleashed optimizer will find and exploit the reward model's bugs.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 640 265" className="w-full max-w-2xl">
          <defs>
            <marker id="rlhf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.6} />
            </marker>
          </defs>
          <Box x={20} y={30} w={130} label="base model" sub="document completer" active={s === 0} />
          <Box x={250} y={30} w={130} label="SFT model" sub="assistant format" active={s <= 1} />
          <Box x={480} y={30} w={140} label="reward model" sub="compressed judgment" active={s === 1 || s === 2} />
          <Box x={250} y={180} w={130} label="final model" sub="RL (PPO)" active={s === 3} />
          <Arrow d="M 150 53 L 243 53" label="demonstrations" lx={197} ly={43} active={s === 0} />
          <Arrow d="M 380 53 L 473 53" label="A ≻ B comparisons" lx={427} ly={36} active={s === 1 || s === 2} />
          <Arrow d="M 315 76 L 315 173" label="samples, gets scored" lx={382} ly={130} active={s === 3} />
          <Arrow d="M 480 76 C 440 120, 420 150, 387 185" dashed active={s === 3} />
          <Arrow d="M 250 192 C 180 180, 170 120, 233 80" label="KL leash" lx={168} ly={140} active={s === 3} />
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
