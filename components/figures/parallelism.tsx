import { Figure } from './figure';

// The four standard ways to split a training run across GPUs, as four
// panels of four GPUs each.
function Gpu({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return (
    <g>
      <rect x={x} y={y} width={64} height={46} rx={4} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.5} />
      {lines.map((l, i) => (
        <text key={i} x={x + 32} y={y + (lines.length === 1 ? 28 : 20 + i * 15)} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>
          {l}
        </text>
      ))}
    </g>
  );
}

function Panel({
  x0,
  title,
  sub,
  gpus,
  flow,
}: {
  x0: number;
  title: string;
  sub: string;
  gpus: string[][];
  flow?: boolean;
}) {
  return (
    <g>
      <text x={x0 + 149} y={18} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.9}>
        {title}
      </text>
      {gpus.map((lines, i) => (
        <Gpu key={i} x={x0 + i * 74} y={34} lines={lines} />
      ))}
      {flow &&
        [0, 1, 2].map((i) => (
          <line
            key={i}
            x1={x0 + 64 + i * 74}
            y1={57}
            x2={x0 + 74 + i * 74}
            y2={57}
            stroke="currentColor"
            strokeOpacity={0.6}
            markerEnd="url(#par-arrow)"
          />
        ))}
      <text x={x0 + 149} y={102} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.6}>
        {sub}
      </text>
    </g>
  );
}

export function ParallelismFigure() {
  return (
    <Figure caption="The four ways to split a run, composable and composed. Data parallelism copies the model and splits the batch (cheap to coordinate, memory-hungry). Tensor parallelism splits every matrix (communication on every layer — kept inside a node). Pipeline parallelism splits by layer (an assembly line kept full with micro-batches). Expert parallelism is MoE's gift: tokens travel to whichever GPU holds their experts.">
      <svg viewBox="0 0 640 260" className="w-full max-w-2xl font-mono">
        <defs>
          <marker id="par-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.6} />
          </marker>
        </defs>
        <g transform="translate(10, 0)">
          <Panel
            x0={0}
            title="data parallel"
            sub="full copy each; batch ÷ 4; average gradients"
            gpus={[
              ['model', 'batch ¼'],
              ['model', 'batch ¼'],
              ['model', 'batch ¼'],
              ['model', 'batch ¼'],
            ]}
          />
          <Panel
            x0={322}
            title="tensor parallel"
            sub="every matrix ÷ 4; talk every layer (NVLink)"
            gpus={[
              ['¼ of every', 'matrix'],
              ['¼ of every', 'matrix'],
              ['¼ of every', 'matrix'],
              ['¼ of every', 'matrix'],
            ]}
          />
        </g>
        <g transform="translate(10, 130)">
          <Panel
            x0={0}
            title="pipeline parallel"
            sub="layers in stages; micro-batches keep it full"
            flow
            gpus={[
              ['layers', '1–20'],
              ['layers', '21–40'],
              ['layers', '41–60'],
              ['layers', '61–80'],
            ]}
          />
          <Panel
            x0={322}
            title="expert parallel"
            sub="tokens routed over the network to their experts"
            gpus={[
              ['experts', '1–16'],
              ['experts', '17–32'],
              ['experts', '33–48'],
              ['experts', '49–64'],
            ]}
          />
        </g>
      </svg>
    </Figure>
  );
}
