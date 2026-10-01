import { Figure } from './figure';

// Illustrative 2-D projection of an embedding space: clusters plus the
// famous parallel "relationship directions". Arrow targets are labeled
// above their dot so the arrows (which arrive from below) never hit text.
const POINTS: Array<{ x: number; y: number; label: string; labelAbove?: boolean }> = [
  // royalty parallelogram
  { x: 330, y: 160, label: 'man' },
  { x: 400, y: 140, label: 'woman' },
  { x: 318, y: 70, label: 'king', labelAbove: true },
  { x: 388, y: 50, label: 'queen', labelAbove: true },
  // capitals
  { x: 80, y: 130, label: 'france' },
  { x: 108, y: 58, label: 'paris', labelAbove: true },
  { x: 150, y: 148, label: 'italy' },
  { x: 178, y: 76, label: 'rome', labelAbove: true },
  // a cluster
  { x: 490, y: 185, label: 'cat' },
  { x: 530, y: 168, label: 'dog' },
  { x: 505, y: 206, label: 'kitten' },
  { x: 545, y: 192, label: 'puppy' },
];

const ARROWS: Array<[string, string, string?]> = [
  ['france', 'paris', 'capital of'],
  ['italy', 'rome'],
  ['man', 'king', '+ royal'],
  ['woman', 'queen'],
];

const P = (label: string) => POINTS.find((p) => p.label === label)!;

export function EmbeddingSpaceFigure() {
  return (
    <Figure caption="An embedding space, projected to two dimensions (illustrative — the real thing has thousands). Similar words cluster, and directions carry relationships: the france→paris arrow and the italy→rome arrow are parallel, which is what makes king − man + woman land near queen.">
      <svg viewBox="0 0 600 240" className="w-full max-w-xl">
        <defs>
          <marker id="emb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.6} />
          </marker>
        </defs>
        {ARROWS.map(([a, b, label]) => {
          const pa = P(a);
          const pb = P(b);
          const dx = pb.x - pa.x;
          const dy = pb.y - pa.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / len;
          const uy = dy / len;
          const sx = pa.x + ux * 9;
          const sy = pa.y + uy * 9;
          const ex = pb.x - ux * 9;
          const ey = pb.y - uy * 9;
          return (
            <g key={`${a}-${b}`}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} markerEnd="url(#emb-arrow)" />
              {label && (
                <text
                  x={(pa.x + pb.x) / 2 - 8}
                  y={(pa.y + pb.y) / 2 + 3}
                  textAnchor="end"
                  fontSize={9.5}
                  fontStyle="italic"
                  fill="currentColor"
                  opacity={0.55}
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}
        {POINTS.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r={3} fill="currentColor" fillOpacity={0.75} />
            <text
              x={p.x}
              y={p.labelAbove ? p.y - 9 : p.y + 15}
              textAnchor="middle"
              fontSize={11}
              fill="currentColor"
              opacity={0.8}
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}
