import { ACCENT, Figure } from './figure';

function Block({
  y,
  label,
  color,
}: {
  y: number;
  label: string;
  color: string;
}) {
  return (
    <g>
      {/* read from stream */}
      <path
        d={`M 120 ${y + 52} C 170 ${y + 52}, 170 ${y + 30}, 210 ${y + 30}`}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.4}
        markerEnd="url(#arrow)"
      />
      {/* write back (added) */}
      <path
        d={`M 330 ${y + 30} C 370 ${y + 30}, 170 ${y + 8}, 128 ${y + 8}`}
        fill="none"
        stroke={color}
        markerEnd="url(#arrow)"
      />
      <rect x={210} y={y + 10} width={120} height={40} rx={6} fill={`${color}26`} stroke={color} />
      <text x={270} y={y + 35} textAnchor="middle" fontSize={13} fill="currentColor">
        {label}
      </text>
      <circle cx={120} cy={y + 8} r={9} fill="none" stroke="currentColor" strokeOpacity={0.6} />
      <text x={120} y={y + 12.5} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.8}>
        +
      </text>
    </g>
  );
}

export function ResidualStreamFigure() {
  return (
    <Figure caption="One transformer block, drawn the interpretability way: the residual stream flows upward like a memory bus; attention and the MLP each read from it, compute, and add their result back. A model is this, stacked N times.">
      <svg viewBox="0 0 460 330" className="w-full max-w-md">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.6} />
          </marker>
        </defs>
        <line x1={120} y1={300} x2={120} y2={30} stroke="currentColor" strokeWidth={3} strokeOpacity={0.5} markerEnd="url(#arrow)" />
        <text x={120} y={318} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7}>
          token embedding (enters)
        </text>
        <text x={62} y={170} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7} transform="rotate(-90 62 170)">
          residual stream
        </text>
        <Block y={190} label="attention" color={ACCENT.blue} />
        <Block y={80} label="MLP" color={ACCENT.purple} />
        <text x={270} y={262} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
          moves info between tokens
        </text>
        <text x={270} y={152} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
          computes on each token
        </text>
        <text x={385} y={40} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7}>
          × N layers
        </text>
      </svg>
    </Figure>
  );
}
