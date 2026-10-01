import { Figure, ink } from './figure';

// A plausible next-token distribution; the same numbers reappear in the
// sampling chapter's interactive version.
const ROWS: Array<[string, number]> = [
  [' Paris', 0.62],
  [' the', 0.1],
  [' a', 0.06],
  [' located', 0.05],
  [' known', 0.04],
  [' one', 0.03],
  [' famous', 0.025],
];

export function NextTokenFigure() {
  return (
    <Figure caption={'A language model\'s entire output for one step: a probability for every token in the vocabulary. This is the same softmax from Chapter 1 — with ~100,000 classes instead of 10.'}>
      <div className="w-full max-w-md font-mono text-[11.5px]">
        <div className="mb-2 opacity-70">
          The capital of France is<span className="animate-pulse">▌</span>
        </div>
        {ROWS.map(([tok, p]) => (
          <div key={tok} className="flex items-center gap-2 py-[1px]">
            <span className="w-20 whitespace-pre text-right">{tok}</span>
            <div className="h-3.5 grow rounded-sm" style={{ background: ink(6) }}>
              <div className="h-3.5 rounded-sm" style={{ width: `${p * 100}%`, background: ink(p === 0.62 ? 75 : 45) }} />
            </div>
            <span className="w-12 text-right opacity-60">{(p * 100).toFixed(1)}%</span>
          </div>
        ))}
        <div className="mt-1 text-center opacity-50">⋮ 99,993 more tokens, sharing the remaining 7.5%</div>
      </div>
    </Figure>
  );
}
