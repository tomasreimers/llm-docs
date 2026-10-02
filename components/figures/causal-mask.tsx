import { Figure } from './figure';

const TOKENS = ['the', 'cat', 'sat', 'on', 'the', 'mat'];
const CELL = 30;
const X0 = 80;
const Y0 = 40;

export function CausalMaskFigure() {
  return (
    <Figure caption="The attention score matrix for a six-token context: each row is a token doing the looking, each column a token being looked at. The upper triangle — the future — is masked to −∞ before the softmax. Six tokens make 36 cells; the whole matrix grows with the square of the context length.">
      <svg viewBox="0 0 320 260" className="w-full max-w-xs">
        {TOKENS.map((t, i) => (
          <text key={`r${i}`} x={X0 - 8} y={Y0 + i * CELL + CELL / 2 + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.7}>
            {t}
          </text>
        ))}
        {TOKENS.map((t, j) => (
          <text key={`c${j}`} x={X0 + j * CELL + CELL / 2} y={Y0 - 10} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>
            {t}
          </text>
        ))}
        {TOKENS.map((_, i) =>
          TOKENS.map((_, j) => {
            const allowed = j <= i;
            return (
              <g key={`${i}-${j}`}>
                <rect
                  x={X0 + j * CELL + 1}
                  y={Y0 + i * CELL + 1}
                  width={CELL - 2}
                  height={CELL - 2}
                  rx={2}
                  fill="currentColor"
                  fillOpacity={allowed ? 0.3 : 0.04}
                />
                {!allowed && (
                  <text x={X0 + j * CELL + CELL / 2} y={Y0 + i * CELL + CELL / 2 + 4} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.3}>
                    −∞
                  </text>
                )}
              </g>
            );
          }),
        )}
        <text x={X0 - 52} y={Y0 + (6 * CELL) / 2} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6} transform={`rotate(-90 ${X0 - 52} ${Y0 + (6 * CELL) / 2})`}>
          queries ↓
        </text>
        <text x={X0 + (6 * CELL) / 2} y={28 - 14} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
          keys →
        </text>
      </svg>
    </Figure>
  );
}
