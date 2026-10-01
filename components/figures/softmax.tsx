import { Figure } from './figure';

// The same logits as the linear-classifier figure above.
const LOGITS = [-1.8, 0.6, 1.1, -0.4, -1.2, 0.2, -2.1, 3.4, 0.9, 1.6];
const EXPS = LOGITS.map((y) => Math.exp(y));
const SUM = EXPS.reduce((a, b) => a + b, 0);
const PROBS = EXPS.map((e) => e / SUM);

function Brackets({ x, w, top, h }: { x: number; w: number; top: number; h: number }) {
  return (
    <g>
      <path d={`M ${x} ${top} h -7 v ${h} h 7`} fill="none" stroke="currentColor" strokeOpacity={0.7} />
      <path d={`M ${x + w} ${top} h 7 v ${h} h -7`} fill="none" stroke="currentColor" strokeOpacity={0.7} />
    </g>
  );
}

export function SoftmaxFigure() {
  const top = 24;
  const rowH = 16;
  const h10 = 10 * rowH + 4;

  return (
    <Figure caption="The scores from our linear classifier, before and after softmax. Unbounded reals in; positive numbers summing to 1 out. Note how the exponential amplifies gaps: 3.4 beats 1.6 by less than 2× as a score, but gets six times the probability.">
      <svg viewBox="0 0 460 225" className="w-full max-w-md">
        {/* digit labels */}
        {LOGITS.map((_, d) => (
          <text key={d} x={88} y={top + 8 + d * rowH} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.5}>
            {d}
          </text>
        ))}
        {/* logits */}
        <Brackets x={108} w={46} top={top - 4} h={h10} />
        {LOGITS.map((y, d) => (
          <text key={d} x={131} y={top + 8 + d * rowH} textAnchor="middle" fontSize={9.5} fontWeight={d === 7 ? 700 : 400} fill="currentColor" opacity={d === 7 ? 1 : 0.75}>
            {y.toFixed(1)}
          </text>
        ))}
        <text x={131} y={top + h10 + 20} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          y: logits
        </text>
        <text x={131} y={top + h10 + 36} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.55}>
          any real number
        </text>

        {/* arrow */}
        <line x1={185} y1={top + 80} x2={255} y2={top + 80} stroke="currentColor" strokeOpacity={0.5} />
        <path d={`M 255 ${top + 80} l -7 -4 v 8 z`} fill="currentColor" fillOpacity={0.5} />
        <text x={220} y={top + 68} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>
          softmax
        </text>

        {/* probabilities */}
        <Brackets x={285} w={52} top={top - 4} h={h10} />
        {PROBS.map((p, d) => (
          <g key={d}>
            {d === 7 && <rect x={285} y={top - 2 + d * rowH} width={52} height={rowH - 3} rx={2} fill="currentColor" fillOpacity={0.1} />}
            <text x={311} y={top + 8 + d * rowH} textAnchor="middle" fontSize={9.5} fontWeight={d === 7 ? 700 : 400} fill="currentColor" opacity={d === 7 ? 1 : 0.75}>
              {(p * 100).toFixed(1)}%
            </text>
          </g>
        ))}
        <text x={311} y={top + h10 + 20} textAnchor="middle" fontSize={11.5} fill="currentColor" opacity={0.7}>
          p: probabilities
        </text>
        <text x={311} y={top + h10 + 36} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.55}>
          positive, sums to 1
        </text>
      </svg>
    </Figure>
  );
}
