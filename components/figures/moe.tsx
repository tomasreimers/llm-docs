import { ACCENT, Figure } from './figure';

const EXPERTS = Array.from({ length: 8 }, (_, i) => ({
  i,
  x: 430,
  y: 22 + i * 34,
}));

export function MoeFigure() {
  return (
    <Figure caption="Mixture of experts: a learned router picks 2 of 8 expert MLPs per token. All eight sets of weights exist (total parameters); only two run (active parameters).">
      <svg viewBox="0 0 620 300" className="w-full max-w-xl">
        <rect x={20} y={125} width={110} height={40} rx={6} fill="none" stroke="currentColor" strokeOpacity={0.5} />
        <text x={75} y={150} textAnchor="middle" fontSize={13} fill="currentColor">
          token
        </text>
        <line x1={130} y1={145} x2={205} y2={145} stroke="currentColor" strokeOpacity={0.5} />
        <g>
          <polygon points="270,105 335,145 270,185 205,145" fill={`${ACCENT.orange}26`} stroke={ACCENT.orange} />
          <text x={270} y={150} textAnchor="middle" fontSize={13} fill="currentColor">
            router
          </text>
        </g>
        {EXPERTS.map(({ i, x, y }) => {
          const active = i === 2 || i === 6;
          const color = active ? ACCENT.blue : 'currentColor';
          return (
            <g key={i}>
              <line
                x1={335}
                y1={145}
                x2={x}
                y2={y + 13}
                stroke={active ? ACCENT.blue : 'currentColor'}
                strokeOpacity={active ? 0.9 : 0.15}
                strokeWidth={active ? 2 : 1}
              />
              <rect
                x={x}
                y={y}
                width={130}
                height={26}
                rx={5}
                fill={active ? `${ACCENT.blue}26` : 'none'}
                stroke={color}
                strokeOpacity={active ? 1 : 0.3}
              />
              <text x={x + 65} y={y + 17} textAnchor="middle" fontSize={12} fill="currentColor" opacity={active ? 1 : 0.45}>
                expert {i + 1} (MLP)
              </text>
            </g>
          );
        })}
        <text x={505} y={110} fontSize={11} fill={ACCENT.blue}>
          0.7
        </text>
        <text x={492} y={232} fontSize={11} fill={ACCENT.blue}>
          0.3
        </text>
      </svg>
    </Figure>
  );
}
