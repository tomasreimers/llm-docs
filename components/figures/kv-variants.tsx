import { Figure, ink } from './figure';

const ROWS: Array<{ label: string; detail: string; pct: number }> = [
  { label: 'MHA', detail: '64 KV heads (one per query head)', pct: 100 },
  { label: 'GQA', detail: '8 KV heads shared by groups', pct: 12.5 },
  { label: 'MLA', detail: 'compressed latent per token', pct: 4 },
];

export function KvVariantsFigure() {
  return (
    <Figure caption="KV cache bytes per token of context, relative to vanilla multi-head attention. The progression MHA → GQA → MLA is the industry whittling down its most expensive data structure.">
      <div className="w-full max-w-xl font-mono text-sm">
        {ROWS.map((r) => (
          <div key={r.label} className="mb-3">
            <div className="mb-1 flex justify-between text-xs">
              <span>
                <span className="font-bold">{r.label}</span>
                <span className="ml-2 opacity-60">{r.detail}</span>
              </span>
              <span className="opacity-60">{r.pct}%</span>
            </div>
            <div className="h-4 w-full rounded-sm bg-gray-500/10">
              <div
                className="h-4 rounded-sm"
                style={{ width: `${r.pct}%`, background: ink(60), minWidth: 6 }}
              />
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}
