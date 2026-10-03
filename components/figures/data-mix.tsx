import { Figure, ink } from './figure';

// Llama 3's published pre-training mix (The Llama 3 Herd of Models, §3.1.3):
// roughly 50% general knowledge, 25% mathematical and reasoning data,
// 17% code, 8% multilingual.
const SLICES: Array<{ label: string; pct: number }> = [
  { label: 'general knowledge', pct: 50 },
  { label: 'math & reasoning', pct: 25 },
  { label: 'code', pct: 17 },
  { label: 'multilingual', pct: 8 },
];

export function DataMixFigure() {
  return (
    <Figure caption="The data mix is a product decision: Llama 3's published pre-training ratios. Every 2026 model is good at code because its makers chose code to be a sixth of everything it ever read — a choice that also, for reasons still debated, appears to improve reasoning in general.">
      <div className="w-full max-w-xl font-mono text-xs">
        <div className="flex h-12 w-full overflow-hidden rounded-sm">
          {SLICES.map((s, i) => (
            <div
              key={s.label}
              className="flex h-12 items-center justify-center"
              style={{ width: `${s.pct}%`, background: ink(60 - i * 14) }}
            >
              <span className="px-1 opacity-90">{s.pct}%</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex w-full flex-wrap gap-x-5 gap-y-1">
          {SLICES.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1.5 opacity-75">
              <span className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: ink(60 - i * 14) }} />
              {s.label} — {s.pct}%
            </div>
          ))}
        </div>
      </div>
    </Figure>
  );
}
