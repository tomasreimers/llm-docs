import { Figure } from './figure';

const FEATURES = [
  { angle: 90, label: 'feature A' },
  { angle: 162, label: 'feature B' },
  { angle: 234, label: 'feature C' },
  { angle: 306, label: 'feature D' },
  { angle: 18, label: 'feature E' },
];

export function SuperpositionFigure() {
  const cx = 170;
  const cy = 160;
  const r = 110;

  return (
    <Figure caption="Superposition in a toy 2-dimensional space: five features packed into two dimensions as almost-orthogonal directions. Each pair interferes a little — the price of representing more things than you have dimensions.">
      <svg viewBox="0 0 340 320" className="w-full max-w-sm">
        <line x1={cx - r - 15} y1={cy} x2={cx + r + 15} y2={cy} stroke="currentColor" strokeOpacity={0.2} strokeDasharray="4 4" />
        <line x1={cx} y1={cy - r - 15} x2={cx} y2={cy + r + 15} stroke="currentColor" strokeOpacity={0.2} strokeDasharray="4 4" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeOpacity={0.15} />
        {FEATURES.map((f) => {
          const rad = (f.angle * Math.PI) / 180;
          const x2 = cx + r * Math.cos(rad);
          const y2 = cy - r * Math.sin(rad);
          const lx = cx + (r + 24) * Math.cos(rad);
          const ly = cy - (r + 24) * Math.sin(rad);
          return (
            <g key={f.label}>
              <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="currentColor" strokeOpacity={0.8} strokeWidth={2.5} />
              <circle cx={x2} cy={y2} r={4} fill="currentColor" fillOpacity={0.8} />
              <text x={lx} y={ly + 4} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.8}>
                {f.label}
              </text>
            </g>
          );
        })}
        <text x={cx + 8} y={cy + r + 34} fontSize={11} fill="currentColor" opacity={0.6} textAnchor="middle">
          2 neurons, 5 features — every neuron polysemantic
        </text>
      </svg>
    </Figure>
  );
}
