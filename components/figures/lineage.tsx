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

export function LineageFigure() {
  return (
    <Figure caption="The transformer family tree, each branch drawn with its attention mask. The 2017 original paired an encoder (every token sees every token) with a decoder (causal) for translation. The descendants split the towers — and the decoder-only branch is every model in the rest of this book.">
      <svg viewBox="0 0 620 300" className="w-full max-w-xl">
        <defs>
          <marker id="lin-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.55} />
          </marker>
        </defs>

        {/* the 2017 original */}
        <rect x={195} y={18} width={230} height={100} rx={4} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.5} />
        <text x={310} y={38} textAnchor="middle" fontSize={12} fill="currentColor">
          the transformer (2017)
        </text>
        <text x={310} y={53} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.6}>
          encoder + decoder, built for translation
        </text>
        <MaskGrid x={238} y={62} causal={false} />
        <MaskGrid x={338} y={62} causal />
        <line x1={286} y1={84} x2={332} y2={84} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#lin-arrow)" />
        <text x={260} y={120 - 4} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.55}>
          encoder
        </text>
        <text x={360} y={120 - 4} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.55}>
          decoder
        </text>

        {/* branches */}
        <line x1={250} y1={120} x2={160} y2={165} stroke="currentColor" strokeOpacity={0.45} markerEnd="url(#lin-arrow)" />
        <line x1={370} y1={120} x2={460} y2={165} stroke="currentColor" strokeOpacity={0.45} markerEnd="url(#lin-arrow)" />

        {/* encoder-only */}
        <rect x={40} y={172} width={240} height={105} rx={4} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.5} />
        <text x={160} y={192} textAnchor="middle" fontSize={12} fill="currentColor">
          encoder-only — BERT (2018)
        </text>
        <MaskGrid x={138} y={200} causal={false} />
        <text x={160} y={262} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          every token sees every token
        </text>
        <text x={160} y={275} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          for reading: search, classification
        </text>

        {/* decoder-only */}
        <rect x={340} y={172} width={240} height={105} rx={4} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.8} strokeWidth={1.5} />
        <text x={460} y={192} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">
          decoder-only — GPT (2018–)
        </text>
        <MaskGrid x={438} y={200} causal />
        <text x={460} y={262} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          every token sees only its past
        </text>
        <text x={460} y={275} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          for writing: every model in this book
        </text>
      </svg>
    </Figure>
  );
}
