import { Figure } from './figure';

// x: year 2019..2026 → 50..530; y: 0..100% → 280..30
const X = (yr: number) => 50 + ((yr - 2019) / 7) * 480;
const Y = (pct: number) => 280 - (pct / 100) * 250;

const SERIES: Array<{ label: string; dash?: string; pts: Array<[number, number]> }> = [
  { label: 'MMLU', pts: [[2020, 44], [2022, 70], [2023, 86], [2024, 90], [2026, 92]] },
  { label: 'GSM8K', dash: '7 4', pts: [[2021, 17], [2022, 58], [2023, 92], [2024, 96], [2026, 97]] },
  { label: 'GPQA', dash: '2 4', pts: [[2023, 28], [2024, 50], [2025, 70], [2026, 85]] },
  { label: 'SWE-bench', dash: '10 4 2 4', pts: [[2023, 4], [2024, 33], [2025, 62], [2026, 75]] },
];

export function BenchmarkSaturationFigure() {
  return (
    <Figure caption="The life cycle of a benchmark: frontier-model scores climb until the test stops discriminating, and a harder test must be minted. Scores approximate, from public reporting.">
      <svg viewBox="0 0 600 320" className="w-full max-w-xl">
        {[0, 25, 50, 75, 100].map((p) => (
          <g key={p}>
            <line x1={50} y1={Y(p)} x2={530} y2={Y(p)} stroke="currentColor" strokeOpacity={0.08} />
            <text x={40} y={Y(p) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>
              {p}%
            </text>
          </g>
        ))}
        {[2019, 2021, 2023, 2025].map((yr) => (
          <text key={yr} x={X(yr)} y={300} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
            {yr}
          </text>
        ))}
        <line x1={50} y1={Y(90)} x2={530} y2={Y(90)} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="5 5" />
        <text x={56} y={Y(90) - 6} fontSize={10.5} fill="currentColor" opacity={0.6}>
          effective ceiling (label noise)
        </text>
        {SERIES.map((s) => (
          <g key={s.label}>
            <path
              d={s.pts.map(([yr, p], i) => `${i === 0 ? 'M' : 'L'} ${X(yr).toFixed(1)} ${Y(p).toFixed(1)}`).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.8}
              strokeWidth={2}
              strokeDasharray={s.dash}
            />
            <text x={X(s.pts[s.pts.length - 1][0]) + 6} y={Y(s.pts[s.pts.length - 1][1]) + 4} fontSize={11.5} fill="currentColor" opacity={0.85}>
              {s.label}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}
