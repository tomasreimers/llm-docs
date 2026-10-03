import { Figure } from './figure';

// An image becomes tokens: chop into a grid of patches, flatten each
// patch, project it into embedding space, and append to the sequence.
const GRID = 4;
const CELL = 30;
const IX = 30;
const IY = 50;

// a simple "picture": which cells the drawn circle passes through
const shadeFor = (r: number, c: number) => {
  // distance of cell center from image center
  const cxp = IX + (c + 0.5) * CELL;
  const cyp = IY + (r + 0.5) * CELL;
  const d = Math.hypot(cxp - (IX + 2 * CELL), cyp - (IY + 2 * CELL));
  return d < 38 ? 0.35 : d < 58 ? 0.15 : 0.05;
};

export function VitFigure() {
  return (
    <Figure caption="A Vision Transformer eats an image the only way a transformer eats anything: as a sequence. The image is chopped into a grid of patches (16×16 pixels in the original ViT; 4×4 patches shown), each patch is flattened and projected to an embedding vector — exactly one 'token' — and the sequence continues as if the image were words.">
      <svg viewBox="0 0 640 230" className="w-full max-w-xl font-mono">
        <text x={IX + 2 * CELL} y={IY - 14} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>
          image
        </text>
        {/* image as patch grid */}
        {Array.from({ length: GRID }, (_, r) =>
          Array.from({ length: GRID }, (_, c) => (
            <rect
              key={`${r}-${c}`}
              x={IX + c * CELL}
              y={IY + r * CELL}
              width={CELL - 2}
              height={CELL - 2}
              rx={2}
              fill="currentColor"
              fillOpacity={shadeFor(r, c)}
              stroke="currentColor"
              strokeOpacity={0.3}
            />
          )),
        )}

        {/* arrow */}
        <defs>
          <marker id="vit-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.6} />
          </marker>
        </defs>
        <line x1={IX + GRID * CELL + 12} y1={IY + 2 * CELL} x2={IX + GRID * CELL + 62} y2={IY + 2 * CELL} stroke="currentColor" strokeOpacity={0.6} markerEnd="url(#vit-arrow)" />
        <text x={IX + GRID * CELL + 37} y={IY + 2 * CELL - 10} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          flatten +
        </text>
        <text x={IX + GRID * CELL + 37} y={IY + 2 * CELL + 22} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          project
        </text>

        {/* token sequence: text tokens then patch tokens */}
        {['describe', 'this', ':'].map((t, i) => (
          <g key={t}>
            <rect x={230 + i * 62} y={IY + 2 * CELL - 16} width={56} height={32} rx={4} fill="none" stroke="currentColor" strokeOpacity={0.45} />
            <text x={258 + i * 62} y={IY + 2 * CELL + 4} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.75}>
              {t}
            </text>
          </g>
        ))}
        {Array.from({ length: 6 }, (_, i) => {
          const r = Math.floor(i / GRID);
          const c = i % GRID;
          return (
            <g key={i}>
              <rect
                x={230 + 3 * 62 + i * 32}
                y={IY + 2 * CELL - 16}
                width={26}
                height={32}
                rx={4}
                fill="currentColor"
                fillOpacity={shadeFor(r, c)}
                stroke="currentColor"
                strokeOpacity={0.45}
              />
            </g>
          );
        })}
        <text x={230 + 3 * 62 + 6 * 32 + 10} y={IY + 2 * CELL + 5} fontSize={12} fill="currentColor" opacity={0.6}>
          …
        </text>
        <text x={230 + 3 * 62 + 3 * 32} y={IY + 2 * CELL + 40} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          patch tokens (16 of them)
        </text>
        <text x={230 + 1.5 * 62} y={IY + 2 * CELL + 40} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.65}>
          text tokens
        </text>
        <text x={320} y={IY + 2 * CELL - 46} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>
          one sequence, same transformer
        </text>
      </svg>
    </Figure>
  );
}
