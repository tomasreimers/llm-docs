import { Figure } from './figure';

// x: log10(arithmetic intensity) 0..4 → 60..530
// y: log10(TFLOPs) 0..3.3 → 280..20
const X = (logI: number) => 60 + (logI / 4) * 470;
const Y = (logT: number) => 280 - (logT / 3.3) * 260;

const RIDGE = Math.log10(295); // ~989 TFLOPs / 3.35 TB/s
const ROOF = Math.log10(989);

export function RooflineFigure() {
  return (
    <Figure caption="The roofline of an H100: below ~300 FLOPs per byte, performance is capped by memory bandwidth, not compute. Prefill and training live on the roof; single-stream decode is pinned to the far left of the slope.">
      <svg viewBox="0 0 580 330" className="w-full max-w-xl">
        {[0, 1, 2, 3, 4].map((d) => (
          <g key={d}>
            <line x1={X(d)} y1={20} x2={X(d)} y2={280} stroke="currentColor" strokeOpacity={0.08} />
            <text x={X(d)} y={298} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
              {['1', '10', '100', '1K', '10K'][d]}
            </text>
          </g>
        ))}
        {[0, 1, 2, 3].map((d) => (
          <text key={d} x={48} y={Y(d) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>
            {['1', '10', '100', '1000'][d]}
          </text>
        ))}
        <text x={295} y={320} textAnchor="middle" fontSize={12.5} fill="currentColor" opacity={0.8}>
          arithmetic intensity (FLOPs per byte, log)
        </text>
        <text x={16} y={150} textAnchor="middle" fontSize={12.5} fill="currentColor" opacity={0.8} transform="rotate(-90 16 150)">
          TFLOPs achieved (log)
        </text>
        {/* bandwidth slope: perf = 3.35 * intensity */}
        <line x1={X(0)} y1={Y(Math.log10(3.35))} x2={X(RIDGE)} y2={Y(ROOF)} stroke="currentColor" strokeOpacity={0.85} strokeWidth={2.5} />
        {/* compute roof */}
        <line x1={X(RIDGE)} y1={Y(ROOF)} x2={X(4)} y2={Y(ROOF)} stroke="currentColor" strokeOpacity={0.85} strokeWidth={2.5} />
        <line x1={X(RIDGE)} y1={Y(ROOF)} x2={X(RIDGE)} y2={280} stroke="currentColor" strokeOpacity={0.25} strokeDasharray="4 4" />
        <text x={X(RIDGE)} y={272} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.6}>
          ~300
        </text>
        <text x={X(0.9)} y={Y(0.8) - 14} fontSize={11.5} fill="currentColor" opacity={0.7} transform={`rotate(-29 ${X(0.9)} ${Y(0.8) - 14})`}>
          memory-bound (3.35 TB/s)
        </text>
        <text x={X(3.2)} y={Y(ROOF) - 18} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          compute-bound (~1 PFLOP roof)
        </text>
        {[
          { i: 0, label: 'decode, batch = 1', dx: 9, dy: 18, anchor: 'start' },
          { i: 1.5, label: 'decode, batched', dx: -10, dy: -8, anchor: 'end' },
          { i: 3.2, label: 'prefill / training', dx: 9, dy: 32, anchor: 'start', onRoof: true },
        ].map((p) => {
          const logT = p.onRoof ? ROOF : Math.log10(3.35) + p.i;
          return (
            <g key={p.label}>
              <circle cx={X(p.i)} cy={Y(logT)} r={5} fill="currentColor" />
              <text
                x={X(p.i) + p.dx}
                y={Y(logT) + p.dy}
                textAnchor={p.anchor}
                fontSize={11}
                fill="currentColor"
                opacity={0.85}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}
