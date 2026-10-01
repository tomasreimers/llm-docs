'use client';

import { useEffect, useState } from 'react';

import { Figure } from './figure';

// A [2, 2, 1] network as a computational graph. Selecting a weight highlights
// the backward path from the loss to that weight and shows its chain-rule
// product. The point: the early factors are shared across weights.
const NODES: Record<string, { x: number; y: number; label: string }> = {
  x1: { x: 80, y: 55, label: 'x₁' },
  x2: { x: 80, y: 165, label: 'x₂' },
  h1: { x: 250, y: 55, label: 'h₁' },
  h2: { x: 250, y: 165, label: 'h₂' },
  y: { x: 410, y: 110, label: 'ŷ' },
  L: { x: 523, y: 110, label: 'L' },
};

const R = 18;

const WEIGHTS: Array<{
  from: keyof typeof NODES;
  to: keyof typeof NODES;
  label: string;
  lt: number; // label position along the edge
  formula: string;
  path: string[]; // node ids on the backward path
}> = [
  { from: 'x1', to: 'h1', label: 'w₁₁', lt: 0.42, formula: '∂L/∂w₁₁ = ∂L/∂ŷ · v₁ · relu′(h₁) · x₁', path: ['L', 'y', 'h1', 'x1'] },
  { from: 'x1', to: 'h2', label: 'w₁₂', lt: 0.25, formula: '∂L/∂w₁₂ = ∂L/∂ŷ · v₂ · relu′(h₂) · x₁', path: ['L', 'y', 'h2', 'x1'] },
  { from: 'x2', to: 'h1', label: 'w₂₁', lt: 0.25, formula: '∂L/∂w₂₁ = ∂L/∂ŷ · v₁ · relu′(h₁) · x₂', path: ['L', 'y', 'h1', 'x2'] },
  { from: 'x2', to: 'h2', label: 'w₂₂', lt: 0.42, formula: '∂L/∂w₂₂ = ∂L/∂ŷ · v₂ · relu′(h₂) · x₂', path: ['L', 'y', 'h2', 'x2'] },
  { from: 'h1', to: 'y', label: 'v₁', lt: 0.45, formula: '∂L/∂v₁ = ∂L/∂ŷ · h₁', path: ['L', 'y', 'h1'] },
  { from: 'h2', to: 'y', label: 'v₂', lt: 0.45, formula: '∂L/∂v₂ = ∂L/∂ŷ · h₂', path: ['L', 'y', 'h2'] },
];

function onPath(path: string[], a: string, b: string) {
  const ia = path.indexOf(a);
  const ib = path.indexOf(b);
  return ia >= 0 && ib >= 0 && Math.abs(ia - ib) === 1;
}

export function ComputationalGraphFigure() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (hovering) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % WEIGHTS.length),
      2000,
    );
    return () => window.clearInterval(id);
  }, [hovering]);

  const path = WEIGHTS[active].path;
  const allEdges: Array<[string, string]> = [
    ...WEIGHTS.map((w) => [w.from, w.to] as [string, string]),
    ['y', 'L'],
  ];

  return (
    <Figure caption="The computational graph of a [2, 2, 1] network. Hover a weight to see its gradient's path back from the loss. Note what every formula shares: ∂L/∂ŷ (and each ∂L/∂h) is computed once and reused by every weight upstream — that reuse is why all the gradients together cost about two forward passes.">
      <div
        className="flex w-full flex-col items-center"
        onMouseLeave={() => setHovering(false)}
      >
        <svg viewBox="0 0 560 215" className="w-full max-w-xl">
          <defs>
            <marker id="cg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.7} />
            </marker>
          </defs>

          {/* edges */}
          {allEdges.map(([a, b], i) => {
            const na = NODES[a];
            const nb = NODES[b];
            const hot = onPath(path, a, b);
            const dx = nb.x - na.x;
            const dy = nb.y - na.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const sx = na.x + (dx / len) * R;
            const sy = na.y + (dy / len) * R;
            let ex = nb.x - (dx / len) * (R + 3);
            let ey = nb.y - (dy / len) * (R + 3);
            if (b === 'L') {
              // the loss is a box, not a circle
              ex = nb.x - 45;
              ey = nb.y;
            }
            const w = i < WEIGHTS.length ? WEIGHTS[i] : null;
            return (
              <g key={`${a}-${b}`}>
                <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="currentColor" strokeOpacity={hot ? 0.95 : 0.2} strokeWidth={hot ? 2.5 : 1.5} markerEnd="url(#cg-arrow)" />
                {w && (
                  <text
                    x={sx + dx * w.lt}
                    y={sy + dy * w.lt - 7}
                    textAnchor="middle"
                    fontSize={10.5}
                    fill="currentColor"
                    opacity={active === i ? 1 : 0.55}
                    fontWeight={active === i ? 700 : 400}
                  >
                    {w.label}
                  </text>
                )}
                {/* fat invisible hover target */}
                {w && (
                  <line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke="currentColor"
                    strokeOpacity={0}
                    strokeWidth={16}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => {
                      setActive(i);
                      setHovering(true);
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* value nodes (circles) */}
          {Object.entries(NODES)
            .filter(([id]) => id !== 'L')
            .map(([id, n]) => {
              const hot = path.includes(id);
              return (
                <g key={id}>
                  <circle cx={n.x} cy={n.y} r={R} fill="currentColor" fillOpacity={hot ? 0.1 : 0.04} stroke="currentColor" strokeOpacity={hot ? 0.85 : 0.35} strokeWidth={hot ? 2 : 1.5} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={12} fill="currentColor" opacity={hot ? 1 : 0.6}>
                    {n.label}
                  </text>
                </g>
              );
            })}

          {/* the loss, drawn as a box: an operation on ŷ, not another value */}
          <g>
            <rect x={NODES.L.x - 42} y={NODES.L.y - 22} width={84} height={44} rx={3} fill="currentColor" fillOpacity={path.includes('L') ? 0.1 : 0.04} stroke="currentColor" strokeOpacity={path.includes('L') ? 0.85 : 0.35} strokeWidth={path.includes('L') ? 2 : 1.5} />
            <text x={NODES.L.x} y={NODES.L.y - 2} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.9}>
              loss L
            </text>
            <text x={NODES.L.x} y={NODES.L.y + 13} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.55}>
              ŷ vs. target
            </text>
          </g>
        </svg>

        <div className="mt-1 flex h-5 items-center justify-center font-mono text-[11.5px] opacity-80">
          {WEIGHTS[active].formula}
        </div>
      </div>
    </Figure>
  );
}
