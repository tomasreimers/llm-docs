import { ACCENT, Figure } from './figure';

const TOKENS: Array<[string, number]> = [
  ['The', 464],
  [' un', 555],
  ['reason', 20080],
  ['able', 540],
  [' effectiveness', 26280],
  [' of', 286],
  [' token', 11241],
  ['ization', 2734],
];

const COLORS = [ACCENT.blue, ACCENT.orange, ACCENT.green, ACCENT.purple];

export function TokenizationFigure() {
  return (
    <Figure caption="A BPE tokenizer at work: common words survive whole, rarer ones split into reusable chunks. The model only ever sees the integer IDs.">
      <div className="flex flex-wrap items-end justify-center gap-y-3 font-mono text-sm">
        {TOKENS.map(([text, id], i) => (
          <div key={id} className="flex flex-col items-center">
            <span
              className="whitespace-pre rounded-sm px-0.5 py-1"
              style={{
                backgroundColor: `${COLORS[i % COLORS.length]}26`,
                boxShadow: `inset 0 -2px 0 ${COLORS[i % COLORS.length]}`,
              }}
            >
              {text}
            </span>
            <span className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {id}
            </span>
          </div>
        ))}
      </div>
    </Figure>
  );
}
