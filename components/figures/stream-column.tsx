import { Figure } from './figure';

// The spreadsheet from the previous section, dimmed, with one column traced
// through the layers: a single token's residual stream.
const TOKENS = ['the', 'cat', 'sat', 'by', 'me'];
const ROWS = ['embeddings', 'layer 1', 'layer 2', 'layer 3'];
const STREAM_COL = 2; // 'sat'

const CW = 72;
const CH = 50; // row pitch
const CELL_H = 30;
const X0 = 88;
const Y0 = 34;

export function StreamColumnFigure() {
  return (
    <Figure caption="One column of the spreadsheet, followed through the layers: a single token's residual stream.">
      <svg viewBox="0 0 470 258" className="w-full max-w-lg font-mono">
        <defs>
          <marker id="sc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.7} />
          </marker>
        </defs>
        {/* column headers */}
        {TOKENS.map((t, c) => (
          <text
            key={c}
            x={X0 + c * CW + CW / 2}
            y={Y0 - 12}
            textAnchor="middle"
            fontSize={11}
            fill="currentColor"
            opacity={c === STREAM_COL ? 0.9 : 0.45}
            fontWeight={c === STREAM_COL ? 700 : 400}
          >
            {t}
          </text>
        ))}
        {/* row labels */}
        {ROWS.map((r, i) => (
          <text key={r} x={X0 - 10} y={Y0 + i * CH + CELL_H / 2 + 4} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.6}>
            {r}
          </text>
        ))}
        {/* cells */}
        {ROWS.map((_, r) =>
          TOKENS.map((_t, c) => (
            <rect
              key={`${r}-${c}`}
              x={X0 + c * CW + 2}
              y={Y0 + r * CH}
              width={CW - 4}
              height={CELL_H}
              rx={3}
              fill="currentColor"
              fillOpacity={c === STREAM_COL ? 0.3 : 0.07}
              stroke="currentColor"
              strokeOpacity={c === STREAM_COL ? 0.7 : 0.25}
              strokeWidth={c === STREAM_COL ? 1.5 : 1}
            />
          )),
        )}
        {/* the stream trace */}
        <line
          x1={X0 + STREAM_COL * CW + CW / 2}
          y1={Y0 + 4}
          x2={X0 + STREAM_COL * CW + CW / 2}
          y2={Y0 + 3 * CH + CELL_H + 8}
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          markerEnd="url(#sc-arrow)"
        />
        <text
          x={X0 + STREAM_COL * CW + CW / 2}
          y={Y0 + 3 * CH + CELL_H + 28}
          textAnchor="middle"
          fontSize={10.5}
          fill="currentColor"
          opacity={0.8}
          fontStyle="italic"
        >
          the residual stream of &apos;{TOKENS[STREAM_COL]}&apos;
        </text>
      </svg>
    </Figure>
  );
}
