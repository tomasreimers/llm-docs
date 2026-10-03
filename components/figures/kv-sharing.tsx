import { Figure } from './figure';

// How query heads share K/V heads: MHA (1:1), GQA (groups share), MQA
// (everyone shares). 8 query heads drawn for legibility; Llama 3 70B runs
// 64 queries over 8 KV heads (the same 8:1 ratio as the middle panel's 4:1,
// scaled up).
const NQ = 8;
const QW = 16; // query square size
const QGAP = 5;
const KVW = 24;
const QY = 36;
const KVY = 104;
const PANEL_W = 198;

function Panel({
  x0,
  nKv,
  title,
  note,
}: {
  x0: number;
  nKv: number;
  title: string;
  note: string;
}) {
  const rowW = NQ * QW + (NQ - 1) * QGAP; // 163
  const qx = (i: number) => x0 + (PANEL_W - rowW) / 2 + i * (QW + QGAP);
  const group = NQ / nKv;
  const kvw = Math.min(KVW, group * (QW + QGAP) - QGAP); // never wider than the group above
  const kvx = (k: number) => {
    // center each KV head under its group of queries
    const first = qx(k * group);
    const last = qx((k + 1) * group - 1) + QW;
    return (first + last) / 2 - kvw / 2;
  };

  return (
    <g>
      <text x={x0 + PANEL_W / 2} y={16} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.85}>
        {title}
      </text>
      {/* query heads */}
      {Array.from({ length: NQ }, (_, i) => (
        <rect key={i} x={qx(i)} y={QY} width={QW} height={QW} rx={3} fill="currentColor" fillOpacity={0.14} stroke="currentColor" strokeOpacity={0.5} />
      ))}
      <text x={x0 + PANEL_W / 2} y={QY - 8} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.55}>
        {NQ} query heads
      </text>
      {/* wiring */}
      {Array.from({ length: NQ }, (_, i) => {
        const k = Math.floor(i / group);
        return (
          <line
            key={i}
            x1={qx(i) + QW / 2}
            y1={QY + QW}
            x2={kvx(k) + kvw / 2}
            y2={KVY}
            stroke="currentColor"
            strokeOpacity={0.4}
            strokeWidth={1.2}
          />
        );
      })}
      {/* KV heads */}
      {Array.from({ length: nKv }, (_, k) => (
        <rect key={k} x={kvx(k)} y={KVY} width={kvw} height={20} rx={3} fill="currentColor" fillOpacity={0.4} stroke="currentColor" strokeOpacity={0.75} />
      ))}
      <text x={x0 + PANEL_W / 2} y={KVY + 38} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.65}>
        {nKv} K/V head{nKv > 1 ? 's' : ''} cached
      </text>
      <text x={x0 + PANEL_W / 2} y={KVY + 54} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.75}>
        {note}
      </text>
    </g>
  );
}

export function KvSharingFigure() {
  return (
    <Figure caption="Sharing means pointing several query heads at the same keys and values. Every query head keeps its own W_q — its own taste in what to look for — but the K/V it searches over is computed (and cached) once per group. Only the bottom row is cached, so shrinking it shrinks the cache proportionally. Drawn with 8 query heads; Llama 3 70B runs the same pattern at 64 queries over 8 K/V heads.">
      <svg viewBox="0 0 640 182" className="w-full max-w-xl font-mono">
        <Panel x0={10} nKv={8} title="MHA" note="1 per query — cache ×1" />
        <Panel x0={221} nKv={2} title="GQA" note="groups share — cache ÷4" />
        <Panel x0={432} nKv={1} title="MQA" note="everyone shares — cache ÷8" />
      </svg>
    </Figure>
  );
}
