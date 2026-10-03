import { Figure } from './figure';

// Honest math: one underlying competence curve — per-token accuracy p,
// rising smoothly (logistically) with log-compute — graded two ways.
// Partial credit reports p itself. All-or-nothing requires a 10-token
// answer to be exactly right: p^10. Same model, same improvement; one
// grader sees a smooth slope, the other sees a cliff.
const p = (logC: number) => 1 / (1 + Math.exp(-(logC - 23) * 1.4));
const exact = (logC: number) => Math.pow(p(logC), 10);

// x: log10(C) ∈ [20, 26]; y: score ∈ [0, 1]
const X = (logC: number) => 70 + ((logC - 20) / 6) * 460;
const Y = (score: number) => 265 - score * 235;

function path(f: (logC: number) => number) {
  const parts: string[] = [];
  for (let l = 20; l <= 26.001; l += 0.1) {
    parts.push(`${parts.length ? 'L' : 'M'} ${X(l).toFixed(1)} ${Y(f(l)).toFixed(1)}`);
  }
  return parts.join(' ');
}

export function EmergenceFigure() {
  return (
    <Figure caption="Emergence as a grading artifact: both curves are the same model improving smoothly — per-token accuracy rising with scale. Grade with partial credit (average tokens correct) and you see the smooth slope. Grade all-or-nothing (a 10-token answer must be exactly right, so the score is p¹⁰) and the same improvement reads as a capability snapping into existence.">
      <svg viewBox="0 0 560 310" className="w-full max-w-xl">
        {[20, 22, 24, 26].map((d) => (
          <g key={d}>
            <line x1={X(d)} y1={25} x2={X(d)} y2={265} stroke="currentColor" strokeOpacity={0.08} />
            <text x={X(d)} y={284} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
              10{String(d).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('')}
            </text>
          </g>
        ))}
        {[0, 0.5, 1].map((v) => (
          <g key={v}>
            <line x1={70} y1={Y(v)} x2={530} y2={Y(v)} stroke="currentColor" strokeOpacity={0.08} />
            <text x={58} y={Y(v) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>
              {Math.round(v * 100)}%
            </text>
          </g>
        ))}
        <text x={300} y={305} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.75}>
          training compute (FLOPs, log scale)
        </text>
        <text x={20} y={145} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.75} transform="rotate(-90 20 145)">
          task score
        </text>

        {/* smooth grader */}
        <path d={path(p)} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 5" />
        <text x={X(22.4)} y={Y(p(22.4)) - 12} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.7}>
          partial credit: average tokens correct
        </text>

        {/* cliff grader */}
        <path d={path(exact)} fill="none" stroke="currentColor" strokeOpacity={0.9} strokeWidth={2.5} />
        <text x={X(24.9) + 10} y={Y(exact(24.9)) + 22} fontSize={11} fill="currentColor" opacity={0.85}>
          all-or-nothing:
        </text>
        <text x={X(24.9) + 10} y={Y(exact(24.9)) + 37} fontSize={11} fill="currentColor" opacity={0.85}>
          whole answer exactly right
        </text>
      </svg>
    </Figure>
  );
}
