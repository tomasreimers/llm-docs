import { Figure } from './figure';

// A low-res handwritten "7" (10×10, intensities 0..0.9).
const GRID: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0.4, 0.9, 0.9, 0.9, 0.9, 0.9, 0.4, 0, 0],
  [0, 0, 0, 0, 0, 0.4, 0.9, 0.4, 0, 0],
  [0, 0, 0, 0, 0, 0.9, 0.4, 0, 0, 0],
  [0, 0, 0, 0, 0.4, 0.9, 0, 0, 0, 0],
  [0, 0, 0, 0, 0.9, 0.4, 0, 0, 0, 0],
  [0, 0, 0, 0.4, 0.9, 0, 0, 0, 0, 0],
  [0, 0, 0, 0.9, 0.4, 0, 0, 0, 0, 0],
  [0, 0, 0.4, 0.9, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const CELL = 13;
const VEC = ['0', '0', '0', '⋮', '.9', '.4', '⋮', '0'];

function ArrowRight({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + 38} y2={y} stroke="currentColor" strokeOpacity={0.5} />
      <path d={`M ${x + 38} ${y} l -7 -4 v 8 z`} fill="currentColor" fillOpacity={0.5} />
      <text x={x + 19} y={y - 10} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.65}>
        {label}
      </text>
    </g>
  );
}

export function FlattenFigure() {
  const gridTop = 35;

  return (
    <Figure caption="From picture to input: the image is just a grid of ink intensities, and reading the grid row-by-row lays it out as one long vector. (Shown at 10×10; the real thing is 28×28 = 784 numbers.)">
      <svg viewBox="0 0 620 210" className="w-full max-w-xl">
        {/* the image */}
        {GRID.map((row, r) =>
          row.map((v, c) => (
            <rect
              key={`${r}-${c}`}
              x={25 + c * CELL}
              y={gridTop + r * CELL}
              width={CELL}
              height={CELL}
              fill="currentColor"
              fillOpacity={v * 0.95}
              stroke="currentColor"
              strokeOpacity={0.12}
            />
          )),
        )}
        <text x={25 + CELL * 5} y={gridTop + CELL * 10 + 20} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          the image
        </text>

        <ArrowRight x={170} y={gridTop + CELL * 5} label="as numbers" />

        {/* the matrix (excerpt: rows 1–6, cols 2–7) */}
        <path d={`M 232 ${gridTop} h -8 v ${CELL * 10} h 8`} fill="none" stroke="currentColor" strokeOpacity={0.7} />
        <path d={`M 388 ${gridTop} h 8 v ${CELL * 10} h -8`} fill="none" stroke="currentColor" strokeOpacity={0.7} />
        {GRID.slice(0, 10).map((row, r) =>
          row.slice(2, 8).map((v, c) => (
            <text
              key={`${r}-${c}`}
              x={245 + c * 24}
              y={gridTop + 10 + r * CELL}
              textAnchor="middle"
              fontSize={9}
              fill="currentColor"
              opacity={v === 0 ? 0.35 : 1}
            >
              {v === 0 ? '0' : `.${v * 10}`}
            </text>
          )),
        )}
        <text x={310} y={gridTop + CELL * 10 + 20} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          a 28×28 matrix (excerpt)
        </text>

        <ArrowRight x={415} y={gridTop + CELL * 5} label="flatten" />

        {/* the vector */}
        <path d={`M 490 ${gridTop - 4} h -8 v ${CELL * 10 + 8} h 8`} fill="none" stroke="currentColor" strokeOpacity={0.7} />
        <path d={`M 530 ${gridTop - 4} h 8 v ${CELL * 10 + 8} h -8`} fill="none" stroke="currentColor" strokeOpacity={0.7} />
        {VEC.map((v, i) => (
          <text
            key={i}
            x={510}
            y={gridTop + 14 + i * 16.5}
            textAnchor="middle"
            fontSize={11}
            fill="currentColor"
            opacity={v === '0' ? 0.35 : 1}
          >
            {v}
          </text>
        ))}
        <text x={510} y={gridTop + CELL * 10 + 20} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          x (784 × 1)
        </text>
      </svg>
    </Figure>
  );
}
