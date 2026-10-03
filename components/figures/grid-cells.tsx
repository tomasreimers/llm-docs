'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// The spreadsheet built one cell at a time: each cell attends to the row
// above, columns up to its own. Companion to KvGridFigure, which then shows
// the row-parallel version.
const TOKENS = ['the', 'cat', 'sat', 'by', 'me'];
const ROWS = ['embeddings', 'layer 1', 'layer 2', 'layer 3'];

const CW = 72;
const CH = 34;
const X0 = 88;
const Y0 = 34;

const PHASE_MS = 1300;
const N_CELLS = 15; // 3 layers × 5 columns
const CYCLE = 1 + N_CELLS + 2; // embeddings + cells + hold

const ROW_START = [0, 1, 6, 11]; // tick at which each row begins

export function GridCellsFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % CYCLE), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const t = Math.min(tick, N_CELLS); // 0 = embeddings; 1..15 = cells
  const cur = t >= 1 && t <= N_CELLS ? { r: 1 + Math.floor((t - 1) / 5), c: (t - 1) % 5 } : null;
  const done = (r: number, c: number) => (r === 0 ? true : (r - 1) * 5 + c + 1 <= t);

  const status =
    t === 0
      ? 'the embedding row: no computation — looked up straight from the matrix (Chapter 2)'
      : cur
        ? `computing (${ROWS[cur.r]}, '${TOKENS[cur.c]}') — attends to ${TOKENS.slice(0, cur.c + 1).join(', ')} in the row above, then runs its MLP`
        : 'done — every cell computed';

  return (
    <Figure caption="The spreadsheet, built the slow way: one cell at a time. Each cell attends only to the row above it, columns up to its own — and notice that no cell ever reads a neighbor in its own row.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 560 190" className="w-full max-w-xl">
          {TOKENS.map((tok, c) => (
            <text key={c} x={X0 + c * CW + CW / 2} y={Y0 - 12} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.75}>
              {tok}
            </text>
          ))}
          {ROWS.map((r, i) => (
            <text key={r} x={X0 - 10} y={Y0 + i * CH + CH / 2 + 4} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.6}>
              {r}
            </text>
          ))}
          {ROWS.map((_, r) =>
            TOKENS.map((_, c) => {
              const isCur = cur && cur.r === r && cur.c === c;
              const filled = done(r, c);
              return (
                <rect
                  key={`${r}-${c}`}
                  x={X0 + c * CW + 2}
                  y={Y0 + r * CH + 2}
                  width={CW - 4}
                  height={CH - 4}
                  rx={3}
                  fill="currentColor"
                  fillOpacity={isCur ? 0.3 : filled ? 0.16 : 0.04}
                  stroke="currentColor"
                  strokeOpacity={isCur ? 0.95 : 0.25}
                  strokeWidth={isCur ? 2 : 1}
                />
              );
            }),
          )}
          {/* fan-in for the current cell */}
          {cur &&
            Array.from({ length: cur.c + 1 }, (_, c) => (
              <line
                key={c}
                x1={X0 + c * CW + CW / 2}
                y1={Y0 + (cur.r - 1) * CH + CH - 2}
                x2={X0 + cur.c * CW + CW / 2}
                y2={Y0 + cur.r * CH + 2}
                stroke="currentColor"
                strokeOpacity={0.5}
                strokeWidth={1.2}
              />
            ))}
        </svg>

        <div className="flex h-9 max-w-xl items-center justify-center text-center leading-tight opacity-80">
          {status}
        </div>

        {/* one pill per row, filling as its cells complete */}
        <div className="flex w-full max-w-xl items-center justify-center gap-1.5">
          {ROWS.map((r, i) => {
            const frac = i === 0 ? (t >= 0 ? 1 : 0) : Math.max(0, Math.min(1, (t - (i - 1) * 5 - 1 + 1) / 5));
            return (
              <button
                key={r}
                aria-label={`Jump to ${r}`}
                onClick={() => setTick(ROW_START[i])}
                className="h-1.5 w-10 overflow-hidden rounded-full"
                style={{ background: ink(15) }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    background: 'currentColor',
                    opacity: 0.65,
                    width: `${frac * 100}%`,
                    transition: 'width 300ms linear',
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </Figure>
  );
}
