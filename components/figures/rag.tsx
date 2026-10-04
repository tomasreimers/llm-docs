'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// The RAG pipeline: offline chunk-and-embed into a vector index; at query
// time, embed the question into the same space, fetch nearest chunks by
// dot product, and paste the winners into the context.

const PHASE_MS = 4200;
const STEP_TEXT = [
  'offline: split the corpus into chunks of a few hundred tokens — big enough to mean something, small enough that several fit in a context',
  "each chunk runs through an embedding model once (Chapter 3's encoder lineage, still on the job) and its vector is stored in an index: meaning, parked as geometry",
  'query time: embed the question with the same model — it lands near the chunks about the same thing — and fetch the nearest few by dot product',
  'optionally rerank the candidates, paste the winners into the context, and generate: the model answers from retrieved text, not frozen memory',
];
const N = STEP_TEXT.length;

// index scatter: chunk vectors (3 form the "refund" cluster)
const DOTS = [
  { x: 450, y: 52 },
  { x: 532, y: 42 },
  { x: 572, y: 86 },
  { x: 440, y: 112 },
  { x: 562, y: 136 },
  { x: 470, y: 224 },
  { x: 546, y: 214 },
  { x: 586, y: 172 },
  { x: 452, y: 174 },
  { x: 492, y: 150, near: true },
  { x: 512, y: 168, near: true },
  { x: 498, y: 184, near: true },
];
const Q = { x: 500, y: 165 };

export function RagFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);

  return (
    <Figure caption="The RAG pipeline. Offline, every chunk of the corpus is embedded once and stored in an index. At query time the question is embedded into the same space, the nearest chunks are fetched by dot product (Chapter 2's 'semantically similar means geometrically close,' now a product feature), optionally reranked, and pasted into the context. The weights never change — fresh knowledge arrives as context.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 620 330" className="w-full max-w-xl">
          <defs>
            <marker id="rag-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" opacity={0.7} />
            </marker>
          </defs>

          {/* offline lane */}
          <text x={20} y={18} textAnchor="start" fontSize={9} fill="currentColor" opacity={0.55}>
            offline — once
          </text>
          <rect x={20} y={30} width={54} height={46} rx={4} fill="currentColor" fillOpacity={s === 0 ? 0.12 : 0.05} stroke="currentColor" strokeOpacity={0.5} style={{ transition: 'fill-opacity 400ms' }} />
          {[40, 48, 56, 64].map((y) => (
            <line key={y} x1={28} y1={y} x2={66} y2={y} stroke="currentColor" strokeOpacity={0.3} />
          ))}
          <text x={47} y={90} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.65}>
            docs
          </text>
          <line x1={74} y1={53} x2={94} y2={53} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#rag-arrow)" />
          {[30, 47, 64].map((y, i) => (
            <rect key={i} x={100} y={y} width={56} height={13} rx={2} fill="currentColor" fillOpacity={s === 0 ? 0.18 : 0.08} stroke="currentColor" strokeOpacity={0.4} style={{ transition: 'fill-opacity 400ms' }} />
          ))}
          <text x={128} y={90} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.65}>
            chunks
          </text>
          <line x1={156} y1={53} x2={194} y2={53} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#rag-arrow)" />
          <rect x={200} y={30} width={96} height={46} rx={4} fill="currentColor" fillOpacity={s === 1 ? 0.12 : 0.05} stroke="currentColor" strokeOpacity={0.6} style={{ transition: 'fill-opacity 400ms' }} />
          <text x={248} y={49} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
            embedding
          </text>
          <text x={248} y={61} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
            model
          </text>
          <line x1={296} y1={53} x2={414} y2={53} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#rag-arrow)" />
          <text x={355} y={44} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={s === 1 ? 0.7 : 0.4} style={{ transition: 'opacity 400ms' }}>
            [0.12, −0.87, …]
          </text>

          {/* query lane */}
          <text x={20} y={196} textAnchor="start" fontSize={9} fill="currentColor" opacity={0.55}>
            query time — every request
          </text>
          <rect x={20} y={208} width={136} height={40} rx={4} fill="currentColor" fillOpacity={s === 2 ? 0.12 : 0.05} stroke="currentColor" strokeOpacity={0.5} style={{ transition: 'fill-opacity 400ms' }} />
          <text x={88} y={225} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
            question:
          </text>
          <text x={88} y={238} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.6}>
            &quot;refund policy?&quot;
          </text>
          <line x1={156} y1={228} x2={194} y2={228} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#rag-arrow)" />
          <rect x={200} y={205} width={96} height={46} rx={4} fill="currentColor" fillOpacity={s === 2 ? 0.12 : 0.05} stroke="currentColor" strokeOpacity={0.6} style={{ transition: 'fill-opacity 400ms' }} />
          <text x={248} y={224} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
            same embedding
          </text>
          <text x={248} y={236} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
            model
          </text>
          <line x1={296} y1={228} x2={458} y2={180} stroke="currentColor" strokeOpacity={s >= 2 ? 0.5 : 0.15} markerEnd="url(#rag-arrow)" style={{ transition: 'stroke-opacity 400ms' }} />
          <text x={378} y={226} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={s === 2 ? 0.7 : 0.3} style={{ transition: 'opacity 400ms' }}>
            [0.09, −0.91, …]
          </text>

          {/* vector index */}
          <rect x={424} y={20} width={176} height={250} rx={6} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="5 4" />
          <text x={512} y={288} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.65}>
            vector index
          </text>
          {DOTS.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={4}
              fill="currentColor"
              fillOpacity={s >= 1 ? (s >= 2 && d.near ? 0.95 : 0.35) : 0}
              style={{ transition: 'fill-opacity 400ms' }}
            />
          ))}
          {/* query point + neighborhood */}
          <g opacity={s >= 2 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <circle cx={Q.x} cy={Q.y} r={5} fill="none" stroke="currentColor" strokeWidth={1.8} />
            <circle cx={Q.x} cy={Q.y} r={30} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 3" />
            <text x={Q.x + 38} y={Q.y - 30} textAnchor="start" fontSize={8.5} fill="currentColor" opacity={0.65}>
              nearest 3
            </text>
          </g>

          {/* assembly */}
          <g opacity={s >= 3 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
            <line x1={460} y1={196} x2={330} y2={300} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="3 3" markerEnd="url(#rag-arrow)" />
            <rect x={20} y={290} width={310} height={28} rx={4} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.5} />
            <text x={175} y={308} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
              context: [chunk 12] [chunk 7] + question → model
            </text>
          </g>
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
