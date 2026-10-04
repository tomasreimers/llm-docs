import { Figure } from './figure';

// Where everything lives during serving: the decode loop, weights, and KV
// caches are GPU-resident; the CPU-side engine holds the queue, runs the
// (de)tokenizer, and decides each step's batch. The only per-step traffic
// across PCIe is sampled token IDs — a few bytes per live request.

export function ServingAnatomyFigure() {
  return (
    <Figure caption="Anatomy of a serving engine. The decode loop never leaves the GPU: weights and KV caches are resident, and each new token is appended on-GPU as the next step's input. What crosses PCIe per step is one sampled token ID per live request — bytes, not tensors — which the CPU-side engine detokenizes, streams to the user, and feeds to its scheduler to decide who is in the next step's batch. The GPU does the arithmetic; the CPU runs the airport.">
      <svg viewBox="0 0 640 300" className="w-full max-w-xl">
        <defs>
          <marker id="sa-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" opacity={0.7} />
          </marker>
        </defs>

        {/* users */}
        <text x={28} y={76} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>
          users
        </text>
        <line x1={14} y1={95} x2={56} y2={95} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#sa-arrow)" />
        <line x1={56} y1={135} x2={14} y2={135} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#sa-arrow)" />
        <text x={35} y={152} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.55}>
          stream
        </text>

        {/* CPU box */}
        <rect x={60} y={40} width={190} height={200} rx={6} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.5} />
        <text x={155} y={58} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.8}>
          CPU — serving engine
        </text>
        {[
          { y: 70, label: 'request queue' },
          { y: 112, label: 'scheduler: picks each' },
          { y: 158, label: 'tokenizer / detokenizer' },
        ].map((b) => (
          <rect key={b.y} x={72} y={b.y} width={166} height={34} rx={4} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.35} />
        ))}
        <text x={155} y={91} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
          request queue
        </text>
        <text x={155} y={127} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
          scheduler: picks each
        </text>
        <text x={155} y={139} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
          step&apos;s batch
        </text>
        <text x={155} y={179} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
          tokenizer / detokenizer
        </text>
        <text x={155} y={224} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.55}>
          holds no weights, no cache —
        </text>
        <text x={155} y={235} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.55}>
          just bookkeeping
        </text>

        {/* PCIe */}
        <line x1={250} y1={95} x2={386} y2={95} stroke="currentColor" strokeOpacity={0.55} markerEnd="url(#sa-arrow)" />
        <text x={320} y={84} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.65}>
          prompt token IDs in
        </text>
        <text x={320} y={118} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.5}>
          PCIe
        </text>
        <line x1={390} y1={140} x2={254} y2={140} stroke="currentColor" strokeOpacity={0.55} markerEnd="url(#sa-arrow)" />
        <text x={320} y={156} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.65}>
          1 token ID per request
        </text>
        <text x={320} y={167} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.65}>
          per step — bytes
        </text>

        {/* GPU box */}
        <rect x={390} y={40} width={230} height={200} rx={6} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.5} />
        <text x={505} y={58} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.8}>
          GPU — HBM + cores
        </text>
        <rect x={402} y={70} width={190} height={30} rx={4} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeOpacity={0.4} />
        <text x={497} y={89} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
          weights — resident
        </text>
        <rect x={402} y={108} width={190} height={30} rx={4} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.4} />
        <text x={497} y={127} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
          KV caches — one per request
        </text>
        <rect x={402} y={146} width={190} height={52} rx={4} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.5} />
        <text x={497} y={165} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
          decode step: read weights
        </text>
        <text x={497} y={177} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
          once → one new token
        </text>
        <text x={497} y={189} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>
          per live request
        </text>
        {/* on-GPU loop-back */}
        <path d="M 592 172 C 614 160, 614 132, 594 123" fill="none" stroke="currentColor" strokeOpacity={0.5} strokeDasharray="4 3" markerEnd="url(#sa-arrow)" />
        <text x={505} y={218} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.55}>
          the new token never leaves: it becomes the
        </text>
        <text x={505} y={229} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.55}>
          next step&apos;s input; its K/V join the cache
        </text>

        {/* thesis */}
        <text x={320} y={284} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>
          weights and caches never cross the bus — the loop lives on the GPU; the CPU decides who&apos;s in it
        </text>
      </svg>
    </Figure>
  );
}
