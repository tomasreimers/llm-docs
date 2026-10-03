import { Figure } from './figure';

// A sparse autoencoder as a decompressor: a dense activation vector is
// re-expressed as a sparse combination over a much larger dictionary of
// feature directions, then reconstructed.
const DENSE = [0.7, 0.3, 0.9, 0.5, 0.8, 0.4, 0.6, 0.75]; // all dims busy
const DICT = 24;
const ACTIVE: Record<number, string> = { 4: 'Golden Gate Bridge', 11: 'driving / travel', 19: 'fog' };

const CELL = 24;
const LX = 60;
const DX = 300;
const RX = 540;
const TOP = 46;

export function SaeFigure() {
  return (
    <Figure caption="A sparse autoencoder re-expresses one layer's dense activation vector (left — every dimension busy, meaning smeared by superposition) as a sparse code over a much larger learned dictionary (middle — millions of candidate features in production, only a handful active), which reconstructs the original (right). The active dictionary entries are the features: individually meaningful, individually steerable.">
      <svg viewBox="0 0 640 382" className="w-full max-w-xl font-mono">
        <defs>
          <marker id="sae-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.55} />
          </marker>
        </defs>

        {/* dense activation */}
        <text x={LX + CELL / 2} y={TOP - 18} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.75}>
          activations
        </text>
        {DENSE.map((v, i) => (
          <rect key={i} x={LX} y={TOP + i * (CELL + 4)} width={CELL} height={CELL} rx={3} fill="currentColor" fillOpacity={v * 0.5} stroke="currentColor" strokeOpacity={0.35} />
        ))}
        <text x={LX + CELL / 2} y={TOP + 8 * (CELL + 4) + 16} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.55}>
          dense
        </text>

        {/* encoder */}
        <line x1={LX + CELL + 14} y1={TOP + 4 * (CELL + 4) - 2} x2={DX - 40} y2={TOP + 4 * (CELL + 4) - 2} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#sae-arrow)" />
        <text x={(LX + CELL + DX - 40) / 2} y={TOP + 4 * (CELL + 4) - 12} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          encode
        </text>

        {/* sparse dictionary */}
        <text x={DX + CELL / 2} y={TOP - 18} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.75}>
          dictionary
        </text>
        {Array.from({ length: DICT }, (_, i) => {
          const col = Math.floor(i / 12);
          const row = i % 12;
          const x = DX + col * (CELL + 6) - (CELL + 6) / 2;
          const y = TOP - 8 + row * (CELL + 2);
          const label = ACTIVE[i];
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={3}
                fill="currentColor"
                fillOpacity={label ? 0.45 : 0.04}
                stroke="currentColor"
                strokeOpacity={label ? 0.85 : 0.2}
                strokeWidth={label ? 1.5 : 1}
              />
              {label && (
                <text x={x + CELL + 10} y={y + CELL / 2 + 4} fontSize={9.5} fill="currentColor" opacity={0.8}>
                  {label}
                </text>
              )}
            </g>
          );
        })}
        <text x={DX} y={TOP - 8 + 12 * (CELL + 2) + 14} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.55}>
          sparse: 3 of 24 active
        </text>

        {/* decoder */}
        <line x1={DX + CELL + 142} y1={TOP + 4 * (CELL + 4) - 2} x2={RX - 14} y2={TOP + 4 * (CELL + 4) - 2} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#sae-arrow)" />
        <text x={(DX + CELL + 142 + RX - 14) / 2} y={TOP + 4 * (CELL + 4) - 12} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          decode
        </text>

        {/* reconstruction */}
        <text x={RX + CELL / 2} y={TOP - 18} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.75}>
          reconstruction
        </text>
        {DENSE.map((v, i) => (
          <rect key={i} x={RX} y={TOP + i * (CELL + 4)} width={CELL} height={CELL} rx={3} fill="currentColor" fillOpacity={v * 0.47} stroke="currentColor" strokeOpacity={0.35} />
        ))}
        <text x={RX + CELL / 2} y={TOP + 8 * (CELL + 4) + 16} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.55}>
          ≈ original
        </text>
      </svg>
    </Figure>
  );
}
