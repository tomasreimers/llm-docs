import { Figure } from './figure';

// The RLVR "aha" dynamics, after DeepSeek-R1's reported training curves:
// trained only on "was the final answer right," accuracy and response
// length climb together — the model discovers that thinking longer wins.
// Curves illustrative (logistic shapes); the phenomenon is the paper's.
const acc = (t: number) => 0.15 + 0.62 / (1 + Math.exp(-(t - 0.45) * 9));
const len = (t: number) => 0.08 + 0.84 / (1 + Math.exp(-(t - 0.55) * 7));

const X = (t: number) => 64 + t * 460;
const Y = (v: number) => 250 - v * 205;

function path(f: (t: number) => number) {
  const parts: string[] = [];
  for (let t = 0; t <= 1.001; t += 0.02) {
    parts.push(`${parts.length ? 'L' : 'M'} ${X(Math.min(t, 1)).toFixed(1)} ${Y(f(Math.min(t, 1))).toFixed(1)}`);
  }
  return parts.join(' ');
}

export function RlvrFigure() {
  return (
    <Figure caption="The RLVR discovery, after DeepSeek-R1's training curves (shapes illustrative; the phenomenon is the paper's): rewarded only on whether the final answer is right, accuracy and response length rise together. Nobody showed the model long reasoning transcripts — thinking longer simply wins under a verifiable reward, so the optimizer found it.">
      <svg viewBox="0 0 560 300" className="w-full max-w-xl">
        {[0, 0.5, 1].map((v) => (
          <line key={v} x1={64} y1={Y(v)} x2={524} y2={Y(v)} stroke="currentColor" strokeOpacity={0.08} />
        ))}
        <text x={294} y={290} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7}>
          RL training steps
        </text>

        {/* accuracy */}
        <path d={path(acc)} fill="none" stroke="currentColor" strokeOpacity={0.9} strokeWidth={2.5} />
        <text x={X(1) - 4} y={Y(acc(1)) + 52} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.8}>
          accuracy: 15% → 77%
        </text>

        {/* response length */}
        <path d={path(len)} fill="none" stroke="currentColor" strokeOpacity={0.55} strokeWidth={2} strokeDasharray="6 5" />
        <text x={X(0.52)} y={Y(len(0.52)) + 24} fontSize={11} fill="currentColor" opacity={0.7}>
          average response length:
        </text>
        <text x={X(0.52)} y={Y(len(0.52)) + 39} fontSize={11} fill="currentColor" opacity={0.7}>
          hundreds → ~10,000 tokens
        </text>
      </svg>
    </Figure>
  );
}
