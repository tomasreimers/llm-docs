import { Figure } from './figure';

const BOXES = [
  { label: 'x', sub: 'pixels', x: 25, w: 70 },
  { label: 'h = W₁x + b₁', sub: 'layer 1', x: 125, w: 120 },
  { label: 'a = relu(h)', sub: 'the branch', x: 275, w: 110 },
  { label: 'y = W₂a + b₂', sub: 'layer 2', x: 415, w: 120 },
  { label: 'L', sub: 'the loss', x: 565, w: 70 },
];

const BACK = ['∂L/∂y', '∂y/∂a', '∂a/∂h', '∂h/∂x'];

export function BackpropFigure() {
  const boxY = 95;
  const boxH = 44;

  return (
    <Figure caption="Backpropagation on our MLP. Forward: compute left to right, remembering every intermediate value. Backward: walk right to left from the loss, multiplying each step's local derivative — the gradient for any weight is the product of the local derivatives on the path between it and the loss.">
      <svg viewBox="0 0 660 250" className="w-full max-w-2xl">
        <defs>
          <marker id="bp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.65} />
          </marker>
        </defs>

        {/* forward sweep label */}
        <text x={330} y={32} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.8}>
          1 — forward pass: compute and remember each value
        </text>
        <line x1={60} y1={48} x2={600} y2={48} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#bp-arrow)" />

        {/* boxes */}
        {BOXES.map((b) => (
          <g key={b.label}>
            <rect x={b.x} y={boxY} width={b.w} height={boxH} rx={3} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.6} />
            <text x={b.x + b.w / 2} y={boxY + 19} textAnchor="middle" fontSize={12} fill="currentColor">
              {b.label}
            </text>
            <text x={b.x + b.w / 2} y={boxY + 35} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.55}>
              {b.sub}
            </text>
          </g>
        ))}

        {/* forward arrows between boxes */}
        {BOXES.slice(0, -1).map((b, i) => (
          <line
            key={i}
            x1={b.x + b.w}
            y1={boxY + boxH / 2}
            x2={BOXES[i + 1].x - 2}
            y2={boxY + boxH / 2}
            stroke="currentColor"
            strokeOpacity={0.6}
            markerEnd="url(#bp-arrow)"
          />
        ))}

        {/* backward sweep */}
        <text x={330} y={238} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.8}>
          2 — backward pass: multiply the local derivatives as you go
        </text>
        {BOXES.slice(0, -1).map((b, i) => {
          const from = BOXES[i + 1].x;
          const to = b.x + b.w;
          return (
            <g key={i}>
              <line
                x1={from}
                y1={boxY + boxH + 28}
                x2={to + 2}
                y2={boxY + boxH + 28}
                stroke="currentColor"
                strokeOpacity={0.6}
                strokeDasharray="5 4"
                markerEnd="url(#bp-arrow)"
              />
              <text x={(from + to) / 2} y={boxY + boxH + 46} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.75}>
                × {BACK[3 - i]}
              </text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}
