import { Figure } from './figure';

// A frontier training cluster, schematically: GPUs inside nodes (NVLink),
// nodes on an InfiniBand fabric (leaf/spine). The pedagogical payload is
// the bandwidth ladder — ~3,350 GB/s (HBM, inside one GPU) vs ~900 GB/s
// (NVLink, inside one node) vs ~50 GB/s per GPU (InfiniBand, across nodes;
// 400 Gb/s links) — and the rule it implies: chatty parallelism stays low
// on the ladder.

const NODE_W = 170;
const NODE_H = 130;
const NODE_Y = 150;
const NODE_XS = [22, 225, 428];

function Node({ x, label, dashed }: { x: number; label: string; dashed?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={NODE_Y}
        width={NODE_W}
        height={NODE_H}
        rx={6}
        fill="currentColor"
        fillOpacity={0.03}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      <text x={x + NODE_W / 2} y={NODE_Y + 16} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.7}>
        {label}
      </text>
      {[0, 1].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={x + 14 + col * 37}
            y={NODE_Y + 26 + row * 30}
            width={32}
            height={24}
            rx={3}
            fill="currentColor"
            fillOpacity={0.1}
            stroke="currentColor"
            strokeOpacity={0.35}
          />
        )),
      )}
      <rect
        x={x + 14}
        y={NODE_Y + 90}
        width={143}
        height={16}
        rx={3}
        fill="currentColor"
        fillOpacity={0.14}
        stroke="currentColor"
        strokeOpacity={0.45}
      />
      <text x={x + NODE_W / 2} y={NODE_Y + 101} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>
        NVLink switch — 900 GB/s
      </text>
    </g>
  );
}

export function ClusterFigure() {
  return (
    <Figure caption="A frontier cluster is a bandwidth ladder. Inside each GPU: HBM at ~3,350 GB/s. Between the 8 GPUs of a node: NVLink at ~900 GB/s. Between nodes: an InfiniBand leaf/spine fabric at ~50 GB/s per GPU (400 Gb/s links) — each step outward several times slower than the last. Parallelism placement follows the ladder: tensor parallelism's twice-per-block all-reduces stay on NVLink; data, pipeline, and expert parallelism, which communicate less often, cross the fabric.">
      <svg viewBox="0 0 620 320" className="w-full max-w-xl">
        {/* spine */}
        <rect x={255} y={14} width={110} height={26} rx={4} fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeOpacity={0.5} />
        <text x={310} y={31} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.85}>
          spine switches
        </text>

        {/* leaves */}
        {[115, 395].map((lx) => (
          <g key={lx}>
            <rect x={lx} y={78} width={110} height={26} rx={4} fill="currentColor" fillOpacity={0.07} stroke="currentColor" strokeOpacity={0.5} />
            <text x={lx + 55} y={95} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.85}>
              leaf switches
            </text>
          </g>
        ))}

        {/* spine-leaf links */}
        <line x1={290} y1={40} x2={170} y2={78} stroke="currentColor" strokeOpacity={0.4} />
        <line x1={330} y1={40} x2={450} y2={78} stroke="currentColor" strokeOpacity={0.4} />

        {/* fabric label */}
        <text x={598} y={54} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.65}>
          InfiniBand fabric — ~50 GB/s per GPU
        </text>
        <text x={598} y={66} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.65}>
          (400 Gb/s links)
        </text>

        {/* leaf-node links */}
        <line x1={170} y1={104} x2={107} y2={150} stroke="currentColor" strokeOpacity={0.4} />
        <line x1={170} y1={104} x2={310} y2={150} stroke="currentColor" strokeOpacity={0.4} />
        <line x1={450} y1={104} x2={513} y2={150} stroke="currentColor" strokeOpacity={0.4} />

        {/* HBM annotation */}
        <text x={60} y={128} textAnchor="start" fontSize={9} fill="currentColor" opacity={0.65}>
          inside each GPU: HBM — 3,350 GB/s
        </text>
        <line x1={56} y1={132} x2={44} y2={172} stroke="currentColor" strokeOpacity={0.35} />

        {/* nodes */}
        <Node x={NODE_XS[0]} label="node 1 — 8× GPU" />
        <Node x={NODE_XS[1]} label="node 2 — 8× GPU" />
        <Node x={NODE_XS[2]} label="node 4,000 — 8× GPU" dashed />

        {/* mapping */}
        <text x={310} y={308} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>
          tensor parallel stays inside a node — data, pipeline, and expert parallelism cross the fabric
        </text>
      </svg>
    </Figure>
  );
}
