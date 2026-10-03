'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// Superposition in a 2D toy space. Two layouts: 2 orthogonal features,
// then 5 features spread 72° apart. The interference number is real:
// cos(72°) ≈ 0.309.
const PACKED = [
  { angle: 90, label: 'A' },
  { angle: 162, label: 'B' },
  { angle: 234, label: 'C' },
  { angle: 306, label: 'D' },
  { angle: 18, label: 'E' },
];
const ORTHO = [
  { angle: 90, label: 'A' },
  { angle: 0, label: 'B' },
];
const COS72 = Math.cos((72 * Math.PI) / 180); // 0.309

const CX = 180;
const CY = 165;
const R = 110;

const PHASE_MS = 3800;
const STEP_TEXT = [
  '2 dimensions hold 2 features perfectly: orthogonal directions, zero interference',
  `cram in 5: spread them 72° apart — every neighboring pair now overlaps by cos 72° ≈ ${COS72.toFixed(2)}`,
  `sparsity is the loophole: concepts are rarely present together, so when only C fires, reading C's direction is nearly clean`,
  'the price: each axis — each neuron — has a component of every feature. No neuron means one thing',
];
const N = STEP_TEXT.length;

function Arrow({ angle, label, dim, cx = CX }: { angle: number; label: string; dim: boolean; cx?: number }) {
  const rad = (angle * Math.PI) / 180;
  const x2 = cx + R * Math.cos(rad);
  const y2 = CY - R * Math.sin(rad);
  const lx = cx + (R + 20) * Math.cos(rad);
  const ly = CY - (R + 20) * Math.sin(rad);
  return (
    <g opacity={dim ? 0.25 : 1} style={{ transition: 'opacity 400ms' }}>
      <line x1={cx} y1={CY} x2={x2} y2={y2} stroke="currentColor" strokeOpacity={0.85} strokeWidth={2.5} />
      <circle cx={x2} cy={y2} r={4} fill="currentColor" fillOpacity={0.85} />
      <text x={lx} y={ly + 4} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.85}>
        {label}
      </text>
    </g>
  );
}

export function SuperpositionFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);
  const packed = s >= 1;

  return (
    <Figure caption="Superposition in a toy 2-dimensional space. Two features fit orthogonally — then five are packed in as almost-orthogonal directions, each neighboring pair interfering by cos 72° ≈ 0.31. Because real features are sparse (most concepts absent from most inputs), the interference is usually affordable — and the result is that individual neurons mean nothing by themselves.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 360 345" className="w-full max-w-sm">
          {/* axes = neurons */}
          <line x1={CX - R - 15} y1={CY} x2={CX + R + 15} y2={CY} stroke="currentColor" strokeOpacity={s === 3 ? 0.6 : 0.2} strokeDasharray="4 4" style={{ transition: 'stroke-opacity 400ms' }} />
          <line x1={CX} y1={CY - R - 15} x2={CX} y2={CY + R + 15} stroke="currentColor" strokeOpacity={s === 3 ? 0.6 : 0.2} strokeDasharray="4 4" style={{ transition: 'stroke-opacity 400ms' }} />
          <text x={CX + R + 18} y={CY + 14} fontSize={10} fill="currentColor" opacity={s === 3 ? 0.8 : 0.35} style={{ transition: 'opacity 400ms' }}>
            neuron 1
          </text>
          <text x={CX - 14} y={CY - R - 4} fontSize={10} fill="currentColor" opacity={s === 3 ? 0.8 : 0.35} textAnchor="end" style={{ transition: 'opacity 400ms' }}>
            neuron 2
          </text>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="currentColor" strokeOpacity={0.15} />

          {/* orthogonal layout */}
          <g opacity={packed ? 0 : 1} style={{ transition: 'opacity 400ms' }}>
            {ORTHO.map((f) => (
              <Arrow key={f.label} angle={f.angle} label={f.label} dim={false} />
            ))}
            <path
              d={`M ${CX + 26} ${CY} A 26 26 0 0 0 ${CX} ${CY - 26}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.5}
            />
            <text x={CX + 30} y={CY - 24} fontSize={10} fill="currentColor" opacity={0.7}>
              90° — cos 0
            </text>
          </g>

          {/* packed layout */}
          <g opacity={packed ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            {PACKED.map((f) => (
              <Arrow key={f.label} angle={f.angle} label={f.label} dim={s === 2 && f.label !== 'C'} />
            ))}
            {/* interference arc between A (90°) and B (162°) */}
            <g opacity={s === 1 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
              <path
                d={`M ${CX + 30 * Math.cos((90 * Math.PI) / 180)} ${CY - 30 * Math.sin((90 * Math.PI) / 180)} A 30 30 0 0 1 ${CX + 30 * Math.cos((162 * Math.PI) / 180)} ${CY - 30 * Math.sin((162 * Math.PI) / 180)}`}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.6}
              />
              <text x={CX - 52} y={CY - 42} fontSize={10} fill="currentColor" opacity={0.75} textAnchor="middle">
                72° — cos ≈ {COS72.toFixed(2)}
              </text>
            </g>
          </g>

          <text x={CX} y={CY + R + 44} fontSize={10.5} fill="currentColor" opacity={0.6} textAnchor="middle">
            {packed ? '2 neurons, 5 features' : '2 neurons, 2 features'}
          </text>
        </svg>

        <div className="flex h-9 max-w-md items-center justify-center text-center leading-tight opacity-80">
          {STEP_TEXT[s]}
        </div>

        <div className="flex w-full max-w-md items-center justify-center gap-1.5">
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
