'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// A [2, 2, 1] network with concrete numbers, stepped through one calculation
// at a time. Both hidden units are active, so relu′ = 1 and is omitted.
//
//   x₁ = 2, x₂ = 1
//   h₁ = relu(0.5·2 + 1·1) = 2      h₂ = relu(1·2 − 1·1) = 1
//   ŷ  = 1·2 + 2·1 = 4              L = (4 − 2)² = 4
//   ∂L/∂ŷ = 4;  ∂L/∂v = 8, 4;  ∂L/∂h = 4, 8;  ∂L/∂w = 8, 4, 16, 8

const PHASE_MS = 2100;

const STEP_TEXT = [
  'forward: h₁ = relu(w₁₁·x₁ + w₂₁·x₂) = relu(0.5·2 + 1·1) = 2',
  'forward: h₂ = relu(w₁₂·x₁ + w₂₂·x₂) = relu(1·2 − 1·1) = 1',
  'forward: ŷ = v₁·h₁ + v₂·h₂ = 1·2 + 2·1 = 4',
  'forward: L = (ŷ − target)² = (4 − 2)² = 4',
  'backward: ∂L/∂ŷ = 2 · (ŷ − target) = 4',
  'backward: ∂L/∂v₁ = ∂L/∂ŷ · h₁ = 8    ∂L/∂v₂ = ∂L/∂ŷ · h₂ = 4',
  'backward: ∂L/∂h₁ = ∂L/∂ŷ · v₁ = 4    ∂L/∂h₂ = ∂L/∂ŷ · v₂ = 8',
  'backward: ∂L/∂w₁₁ = ∂L/∂h₁ · x₁ = 8    ∂L/∂w₂₁ = 4    ∂L/∂w₁₂ = 16    ∂L/∂w₂₂ = 8',
];
const N_STEPS = STEP_TEXT.length;

const NODES: Record<string, { x: number; y: number; label: string; value: string; valueStep: number }> = {
  x1: { x: 55, y: 50, label: 'x₁', value: '2', valueStep: -1 },
  x2: { x: 55, y: 160, label: 'x₂', value: '1', valueStep: -1 },
  h1: { x: 195, y: 50, label: 'h₁', value: '2', valueStep: 0 },
  h2: { x: 195, y: 160, label: 'h₂', value: '1', valueStep: 1 },
  y: { x: 330, y: 105, label: 'ŷ', value: '4', valueStep: 2 },
};

const R = 19;
const LOSS = { x: 425, y: 105 };

const EDGES: Array<{ id: string; from: string; to: string; label: string; lt: number }> = [
  { id: 'w11', from: 'x1', to: 'h1', label: 'w₁₁', lt: 0.45 },
  { id: 'w12', from: 'x1', to: 'h2', label: 'w₁₂', lt: 0.22 },
  { id: 'w21', from: 'x2', to: 'h1', label: 'w₂₁', lt: 0.22 },
  { id: 'w22', from: 'x2', to: 'h2', label: 'w₂₂', lt: 0.45 },
  { id: 'v1', from: 'h1', to: 'y', label: 'v₁', lt: 0.5 },
  { id: 'v2', from: 'h2', to: 'y', label: 'v₂', lt: 0.5 },
  { id: 'yL', from: 'y', to: 'L', label: '', lt: 0.5 },
];

const HOT_EDGES: string[][] = [
  ['w11', 'w21'],
  ['w12', 'w22'],
  ['v1', 'v2'],
  ['yL'],
  ['yL'],
  ['v1', 'v2'],
  ['v1', 'v2'],
  ['w11', 'w12', 'w21', 'w22'],
];

const HOT_NODES: string[][] = [
  ['x1', 'x2', 'h1'],
  ['x1', 'x2', 'h2'],
  ['h1', 'h2', 'y'],
  ['y'],
  ['y'],
  ['y', 'h1', 'h2'],
  ['y', 'h1', 'h2'],
  ['h1', 'h2', 'x1', 'x2'],
];

// The table: every quantity, its value (appearing on its forward step for
// computed values), and its gradient (appearing on its backward step).
const ROWS: Array<{ label: string; value: string; valueStep: number; grad?: string; gradStep?: number }> = [
  { label: 'w₁₁', value: '0.5', valueStep: -1, grad: '8', gradStep: 7 },
  { label: 'w₂₁', value: '1', valueStep: -1, grad: '4', gradStep: 7 },
  { label: 'w₁₂', value: '1', valueStep: -1, grad: '16', gradStep: 7 },
  { label: 'w₂₂', value: '−1', valueStep: -1, grad: '8', gradStep: 7 },
  { label: 'v₁', value: '1', valueStep: -1, grad: '8', gradStep: 5 },
  { label: 'v₂', value: '2', valueStep: -1, grad: '4', gradStep: 5 },
  { label: 'h₁', value: '2', valueStep: 0, grad: '4', gradStep: 6 },
  { label: 'h₂', value: '1', valueStep: 1, grad: '8', gradStep: 6 },
  { label: 'ŷ', value: '4', valueStep: 2, grad: '4', gradStep: 4 },
  { label: 'L', value: '4', valueStep: 3 },
];

const cell = 'px-2 py-[1px] text-right tabular-nums';

export function BackpropFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setTick((t) => (t + 1) % (N_STEPS + 2)),
      PHASE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N_STEPS - 1);
  const backward = s >= 4;
  const pos = (id: string) => (id === 'L' ? LOSS : NODES[id]);

  return (
    <Figure caption="Backpropagation on a two-layer network, one calculation per step: forward to compute (and remember) every value, then backward from the loss, multiplying local derivatives. Both hidden units are active here, so relu′ = 1 and is left out of the arithmetic. Note the reuse: ∂L/∂ŷ is computed once and feeds everything; each ∂L/∂h feeds every weight into that unit.">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full flex-wrap items-center justify-center gap-6">
          <svg viewBox="0 0 490 210" className="w-full max-w-md">
            <defs>
              <marker id="bp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.7} />
              </marker>
            </defs>

            {EDGES.map((e) => {
              const na = pos(e.from);
              const nb = pos(e.to);
              const hot = HOT_EDGES[s].includes(e.id);
              const dx = nb.x - na.x;
              const dy = nb.y - na.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const sx = na.x + (dx / len) * R;
              const sy = na.y + (dy / len) * R;
              let ex = nb.x - (dx / len) * (R + 3);
              let ey = nb.y - (dy / len) * (R + 3);
              if (e.to === 'L') {
                ex = LOSS.x - 42;
                ey = LOSS.y;
              }
              return (
                <g key={e.id}>
                  <line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke="currentColor"
                    strokeOpacity={hot ? 0.9 : 0.2}
                    strokeWidth={hot ? 2.2 : 1.4}
                    strokeDasharray={hot && backward ? '5 4' : undefined}
                    markerEnd="url(#bp-arrow)"
                  />
                  {e.label && (
                    <text x={sx + dx * e.lt} y={sy + dy * e.lt - 6} textAnchor="middle" fontSize={10} fill="currentColor" opacity={hot ? 0.9 : 0.45}>
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}

            {Object.entries(NODES).map(([id, n]) => {
              const hot = HOT_NODES[s].includes(id);
              const computed = n.valueStep < 0 || s >= n.valueStep;
              return (
                <g key={id}>
                  <circle cx={n.x} cy={n.y} r={R} fill="currentColor" fillOpacity={hot ? 0.1 : 0.04} stroke="currentColor" strokeOpacity={hot ? 0.85 : 0.35} strokeWidth={hot ? 2 : 1.4} />
                  <text x={n.x} y={n.y - 3} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.7}>
                    {n.label}
                  </text>
                  <text x={n.x} y={n.y + 12} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="currentColor" opacity={computed ? 0.95 : 0}>
                    {n.value}
                  </text>
                </g>
              );
            })}

            <g>
              <rect x={LOSS.x - 40} y={LOSS.y - 22} width={80} height={44} rx={3} fill="currentColor" fillOpacity={s === 3 || s === 4 ? 0.08 : 0.04} stroke="currentColor" strokeOpacity={s === 3 || s === 4 ? 0.85 : 0.35} strokeWidth={s === 3 || s === 4 ? 2 : 1.4} />
              <text x={LOSS.x} y={LOSS.y - 2} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.9}>
                loss L{s >= 3 ? ' = 4' : ''}
              </text>
              <text x={LOSS.x} y={LOSS.y + 13} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.55}>
                (ŷ − 2)²
              </text>
            </g>
          </svg>

          {/* the numbers, in one place */}
          <table className="font-mono text-[11px]">
            <thead>
              <tr className="opacity-60">
                <th className={cell}> </th>
                <th className={cell}>value</th>
                <th className={cell}>∂L/∂·</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: `1px solid ${ink(20)}` }}>
              {ROWS.map((r) => {
                const hasValue = r.valueStep < 0 || s >= r.valueStep;
                const valueActive = s === r.valueStep;
                const hasGrad = r.grad !== undefined && r.gradStep !== undefined && s >= r.gradStep;
                const gradActive = r.gradStep === s;
                return (
                  <tr key={r.label}>
                    <td className={`${cell} opacity-70`}>{r.label}</td>
                    <td className={cell} style={{ fontWeight: valueActive ? 700 : 400, opacity: hasValue ? (valueActive ? 1 : 0.75) : 0.15 }}>
                      {hasValue ? r.value : '·'}
                    </td>
                    <td className={cell} style={{ fontWeight: gradActive ? 700 : 400, opacity: hasGrad ? (gradActive ? 1 : 0.6) : 0.15 }}>
                      {hasGrad ? r.grad : '·'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-1 flex min-h-6 w-full max-w-2xl items-center justify-center text-center font-mono text-[11px] leading-tight opacity-80">
          {STEP_TEXT[s]}
        </div>

        <div className="mt-2 flex w-full max-w-xl items-center justify-center gap-1.5">
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
