import { Figure, ink } from './figure';

const TOKENS: Array<[string, number]> = [
  ['the', 0.03],
  ['cat', 0.58],
  ['sat', 0.06],
  ['on', 0.02],
  ['the', 0.02],
  ['mat', 0.08],
  ['because', 0.05],
  ['it', 0],
  ['was', 0.05],
  ['tired', 0.11],
];

export function AttentionFigure() {
  return (
    <Figure caption={'One attention head resolving a pronoun: the query from "it" matches the key advertised by "cat", so cat\'s value dominates the weighted average. Shading shows the attention weights.'}>
      <div className="flex flex-wrap justify-center gap-1.5 font-mono text-sm">
        {TOKENS.map(([text, w], i) =>
          w === 0 ? (
            <span
              key={i}
              className="rounded-sm px-1.5 py-1 font-bold"
              style={{ boxShadow: `inset 0 0 0 2px ${ink(80)}` }}
            >
              {text} →
            </span>
          ) : (
            <span
              key={i}
              className="rounded-sm px-1.5 py-1"
              style={{ background: ink(Math.min(w * 100, 60)) }}
            >
              <span>{text}</span>
              <span className="ml-1 align-super text-[10px] opacity-70">
                {w.toFixed(2)}
              </span>
            </span>
          ),
        )}
      </div>
    </Figure>
  );
}
