import { Figure } from './figure';

// Mini attention-mask glyph: the architecture's signature, in 4×4.
function MaskGrid({ x, y, causal, size = 11 }: { x: number; y: number; causal: boolean; size?: number }) {
  return (
    <g>
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={x + c * size}
            y={y + r * size}
            width={size - 1.5}
            height={size - 1.5}
            rx={1.5}
            fill="currentColor"
            fillOpacity={causal ? (c <= r ? 0.45 : 0.06) : 0.45}
          />
        )),
      )}
    </g>
  );
}

const GRID_W = 4 * 11; // 44

export function LineageFigure() {
  return (
    <Figure caption="The transformer family tree, each branch drawn with its attention mask. The 2017 original paired an encoder (every token sees every token) with a decoder (causal) for translation. The descendants split the towers — and the decoder-only branch is every model in the rest of this book.">
      <svg viewBox="0 0 620 345" className="w-full max-w-xl">
        <defs>
          <marker id="lin-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.55} />
          </marker>
        </defs>

        {/* the 2017 original */}
        <rect x={185} y={14} width={250} height={126} rx={4} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.5} />
        <text x={310} y={37} textAnchor="middle" fontSize={12} fill="currentColor">
          the transformer (2017)
        </text>
        <text x={310} y={53} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.6}>
          encoder + decoder, built for translation
        </text>
        <MaskGrid x={238 - GRID_W / 2} y={64} causal={false} />
        <MaskGrid x={382 - GRID_W / 2} y={64} causal />
        <line x1={238 + GRID_W / 2 + 6} y1={86} x2={382 - GRID_W / 2 - 8} y2={86} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#lin-arrow)" />
        <text x={238} y={125} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.55}>
          encoder
        </text>
        <text x={382} y={125} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.55}>
          decoder
        </text>

        {/* branches */}
        <line x1={240} y1={140} x2={168} y2={196} stroke="currentColor" strokeOpacity={0.45} markerEnd="url(#lin-arrow)" />
        <line x1={380} y1={140} x2={452} y2={196} stroke="currentColor" strokeOpacity={0.45} markerEnd="url(#lin-arrow)" />

        {/* encoder-only */}
        <rect x={35} y={202} width={250} height={130} rx={4} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.5} />
        <text x={160} y={226} textAnchor="middle" fontSize={12} fill="currentColor">
          encoder-only — BERT (2018)
        </text>
        <MaskGrid x={160 - GRID_W / 2} y={238} causal={false} />
        <text x={160} y={302} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          every token sees every token
        </text>
        <text x={160} y={318} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          for reading: search, classification
        </text>

        {/* decoder-only */}
        <rect x={335} y={202} width={250} height={130} rx={4} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.8} strokeWidth={1.5} />
        <text x={460} y={226} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">
          decoder-only — GPT (2018–)
        </text>
        <MaskGrid x={460 - GRID_W / 2} y={238} causal />
        <text x={460} y={302} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          every token sees only its past
        </text>
        <text x={460} y={318} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          for writing: every model in this book
        </text>
      </svg>
    </Figure>
  );
}
