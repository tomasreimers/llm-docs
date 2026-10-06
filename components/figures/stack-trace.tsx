'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// One request traced through the assembled serving stack: prefix-cache hit,
// suffix-only prefill, continuously-batched 4-bit decode with speculation,
// and the PagedAttention block pool underneath all of it.

const PHASE_MS = 4200;
const STEP_TEXT = [
  'a request arrives: a long system prompt every request shares, plus a short novel question',
  "prefix-cache hit: the system prompt's KV blocks are already in the pool from earlier requests — its prefill is skipped entirely (the 'cached input' discount on your invoice)",
  'only the novel suffix prefills: a short, parallel, compute-bound pass on the prefill pool',
  'decode joins the continuous batch: each token step shares one 4-bit weight-read with every live conversation, and a draft model stretches each read into several tokens',
  'and underneath it all, PagedAttention: every logical token maps to a physical block in one shared pool — no fragmentation, prefixes shared between requests',
];
const N = STEP_TEXT.length;

export function StackTraceFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);

  const stage = (active: boolean) => ({
    fill: 'currentColor',
    fillOpacity: active ? 0.12 : 0.04,
    stroke: 'currentColor',
    strokeOpacity: active ? 0.85 : 0.4,
    strokeWidth: active ? 1.6 : 1,
    style: { transition: 'all 400ms' } as const,
  });

  return (
    <Figure caption="One request, end to end. The shared system prompt costs nothing — its KV blocks are already resident (prefix cache). Only the novel suffix prefills. Decode then shares every 4-bit weight-read with the whole continuous batch while a draft model turns each read into several tokens — and PagedAttention maps everyone's logical tokens onto one shared pool of physical blocks. None of it knows anything about language.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 620 285" className="w-full max-w-xl">
          <defs>
            <marker id="st-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" opacity={0.7} />
            </marker>
          </defs>

          {/* request bar */}
          <text x={20} y={18} textAnchor="start" fontSize={9} fill="currentColor" opacity={0.65}>
            request
          </text>
          <rect x={20} y={26} width={130} height={28} rx={3} {...stage(s === 0 || s === 1)} />
          <text x={85} y={44} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.85}>
            system prompt
          </text>
          <rect x={152} y={26} width={54} height={28} rx={3} {...stage(s === 0 || s === 2)} />
          <text x={179} y={44} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.85}>
            question
          </text>

          {/* stages */}
          <line x1={206} y1={40} x2={226} y2={40} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#st-arrow)" />
          <rect x={230} y={10} width={110} height={62} rx={5} {...stage(s === 1)} />
          <text x={285} y={30} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.85}>
            prefix cache
          </text>
          <text x={285} y={44} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>
            KV already hot —
          </text>
          <text x={285} y={55} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>
            no prefill
          </text>

          <line x1={340} y1={40} x2={356} y2={40} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#st-arrow)" />
          <rect x={360} y={10} width={110} height={62} rx={5} {...stage(s === 2)} />
          <text x={415} y={30} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.85}>
            prefill pool
          </text>
          <text x={415} y={44} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>
            suffix only ·
          </text>
          <text x={415} y={55} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>
            compute-bound
          </text>

          <line x1={470} y1={40} x2={486} y2={40} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#st-arrow)" />
          <rect x={490} y={10} width={110} height={62} rx={5} {...stage(s === 3)} />
          <text x={545} y={26} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.85}>
            decode pool
          </text>
          <text x={545} y={40} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>
            continuous batch ·
          </text>
          <text x={545} y={51} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>
            4-bit weights ·
          </text>
          <text x={545} y={62} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>
            draft +4 / read
          </text>

          {/* stream out */}
          <line x1={545} y1={72} x2={545} y2={94} stroke="currentColor" strokeOpacity={0.45} markerEnd="url(#st-arrow)" />
          <text x={545} y={108} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.6}>
            tokens stream out
          </text>

          {/* mapping lines, revealed at s4 */}
          {[
            [285, 72, 110, 164],
            [415, 72, 265, 164],
            [545, 114, 450, 164],
          ].map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeOpacity={s === 4 ? 0.45 : 0.08}
              strokeDasharray="3 3"
              style={{ transition: 'stroke-opacity 400ms' }}
            />
          ))}

          {/* block pool */}
          <rect x={20} y={164} width={580} height={78} rx={6} {...stage(s === 4)} />
          {Array.from({ length: 18 }, (_, i) => {
            const group = i < 6 ? 'prefix' : i < 9 ? 'mine' : 'others';
            const hot = (s === 1 && group === 'prefix') || (s === 2 && group === 'mine') || s === 4;
            return (
              <rect
                key={i}
                x={32 + i * 31}
                y={174}
                width={24}
                height={16}
                rx={2}
                fill="currentColor"
                fillOpacity={hot ? 0.3 : group === 'others' ? 0.06 : 0.14}
                stroke="currentColor"
                strokeOpacity={0.3}
                style={{ transition: 'fill-opacity 400ms' }}
              />
            );
          })}
          <text x={110} y={208} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>
            shared prefix blocks
          </text>
          <text x={265} y={208} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>
            this request
          </text>
          <text x={455} y={208} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>
            other conversations
          </text>
          <text x={310} y={230} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>
            PagedAttention block pool — one shared physical HBM
          </text>
        </svg>

        <div className="flex h-12 max-w-xl items-center justify-center text-center leading-tight opacity-80">
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
