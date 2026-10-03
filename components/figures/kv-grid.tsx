'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// The transformer as a spreadsheet: columns are token positions, rows are
// layers (embeddings at the top). Cell (l, t) is computed from row l−1,
// columns 1..t. The next token is read off the bottom-right cell — and
// generating appends a column without touching any existing cell.
const TOKENS = ['the', 'cat', 'sat', 'by', 'me'];
const NEW_TOKEN = 'because';
const ROWS = ['embeddings', 'layer 1', 'layer 2', 'layer 3'];

const CW = 72;
const CH = 50; // row pitch
const CELL_H = 30;
const X0 = 88;
const Y0 = 34;

const PHASE_MS = 3400;

const STEP_TEXT = [
  'row 1: the embeddings — one column per token, straight out of Chapter 2',
  'row 2: all five cells at once — nothing in a row waits for its neighbors',
  'row after row, one parallel shot each, to the top of the stack',
  "the bottom-right cell becomes the logits: the next token is 'because'",
  "generate: append a column and compute only it — no older cell changes. Store them and you never recompute: that's the KV cache",
  "and one column, followed through the layers, is a single token's residual stream — up next",
];

const STREAM_COL = 2; // 'sat'
const N = STEP_TEXT.length;

export function KvGridFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);
  const rowsFilled = s === 0 ? 1 : s === 1 ? 2 : 4;
  // the showcased cell for the fan-in arrows
  const fan = s === 1 ? { r: 1, c: 3 } : s === 4 ? { r: 3, c: 5 } : null;

  const cellState = (r: number, c: number) => {
    if (c === 5) return s === 4 ? 'new' : s === 5 ? 'dim' : 'absent';
    if (r >= rowsFilled) return 'absent';
    if (s === 5) return c === STREAM_COL ? 'stream' : 'dim';
    if (s === 4) return 'cached';
    return 'filled';
  };

  return (
    <Figure caption="The transformer as a spreadsheet: columns are token positions, rows are layers, and cell (row, column) is computed from the row above, columns up to its own — the mask, again. The next token is read off the bottom-right cell. Generating appends a column and computes only it; every older cell is finished forever, which is why caching them (the KV cache, Chapter 11) is such a big deal. And a single column, followed through the layers, is one token's residual stream — the subject of the next section.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 560 270" className="w-full max-w-xl">
          <defs>
            <marker id="kv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.7} />
            </marker>
          </defs>
          {/* column headers */}
          {TOKENS.map((t, c) => (
            <text key={c} x={X0 + c * CW + CW / 2} y={Y0 - 12} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.75}>
              {t}
            </text>
          ))}
          <text x={X0 + 5 * CW + CW / 2} y={Y0 - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor" opacity={s >= 4 ? 0.9 : 0}>
            {NEW_TOKEN}
          </text>
          {/* row labels */}
          {ROWS.map((r, i) => (
            <text key={r} x={X0 - 10} y={Y0 + i * CH + CELL_H / 2 + 4} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.6}>
              {r}
            </text>
          ))}
          {/* cells */}
          {ROWS.map((_, r) =>
            Array.from({ length: 6 }, (_, c) => {
              const st = cellState(r, c);
              if (st === 'absent') return null;
              const isPred = (s === 3 || s === 4) && r === 3 && c === (s === 4 ? 5 : 4);
              return (
                <rect
                  key={`${r}-${c}`}
                  x={X0 + c * CW + 2}
                  y={Y0 + r * CH}
                  width={CW - 4}
                  height={CELL_H}
                  rx={3}
                  fill="currentColor"
                  fillOpacity={st === 'new' || st === 'stream' ? 0.3 : st === 'cached' || st === 'dim' ? 0.07 : 0.18}
                  stroke="currentColor"
                  strokeOpacity={isPred ? 0.95 : st === 'stream' ? 0.7 : 0.25}
                  strokeWidth={isPred || st === 'stream' ? 1.5 : 1}
                />
              );
            }),
          )}
          {/* cached label */}
          {s === 4 && (
            <text x={X0 + 2.5 * CW} y={Y0 + 1 * CH + CELL_H + 12} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.55} fontStyle="italic">
              cached — unchanged
            </text>
          )}
          {/* residual stream column trace */}
          {s === 5 && (
            <g>
              <line
                x1={X0 + STREAM_COL * CW + CW / 2}
                y1={Y0 + 4}
                x2={X0 + STREAM_COL * CW + CW / 2}
                y2={Y0 + 3 * CH + CELL_H + 8}
                stroke="currentColor"
                strokeOpacity={0.7}
                strokeWidth={1.5}
                markerEnd="url(#kv-arrow)"
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
            </g>
          )}
          {/* fan-in arrows */}
          {fan &&
            Array.from({ length: fan.c + 1 }, (_, c) => (
              <line
                key={c}
                x1={X0 + c * CW + CW / 2}
                y1={Y0 + (fan.r - 1) * CH + CELL_H}
                x2={X0 + fan.c * CW + CW / 2}
                y2={Y0 + fan.r * CH}
                stroke="currentColor"
                strokeOpacity={0.45}
                strokeWidth={1.2}
              />
            ))}
          {/* prediction arrow out of bottom-right */}
          {s === 3 && (
            <text x={X0 + 4 * CW + CW / 2} y={Y0 + 3 * CH + CELL_H + 16} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.85}>
              ↓ logits → &apos;{NEW_TOKEN}&apos;
            </text>
          )}
        </svg>

        <div className="flex h-9 max-w-xl items-center justify-center text-center leading-tight opacity-80">
          {STEP_TEXT[s]}
        </div>

        <div className="flex w-full max-w-xl items-center justify-center gap-1.5">
          {STEP_TEXT.map((_, i) => (
            <button
              key={i}
              aria-label={`Jump to step ${i + 1}`}
              onClick={() => setTick(i)}
              className="h-1.5 w-7 overflow-hidden rounded-full"
              style={{ background: ink(15) }}
            >
              <div
                key={`${i}-${i === s ? s : 'static'}`}
                className="h-full rounded-full"
                style={{
                  background: 'currentColor',
                  opacity: 0.65,
                  width: i < s ? '100%' : i > s ? '0%' : undefined,
                  animation: i === s ? `gd-fill ${PHASE_MS}ms linear forwards` : undefined,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </Figure>
  );
}
