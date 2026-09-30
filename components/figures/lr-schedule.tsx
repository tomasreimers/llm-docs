import { ACCENT, Figure } from './figure';

// plot: x 50..530 (progress 0..1), y 180 (lr 0) .. 40 (peak)
const X = (t: number) => 50 + t * 480;
const Y = (lr: number) => 180 - lr * 140;

function path(points: Array<[number, number]>) {
  return points
    .map(([t, lr], i) => `${i === 0 ? 'M' : 'L'} ${X(t).toFixed(1)} ${Y(lr).toFixed(1)}`)
    .join(' ');
}

const N = 60;
const WARMUP = 0.05;

const cosine: Array<[number, number]> = Array.from({ length: N + 1 }, (_, i) => {
  const t = i / N;
  if (t < WARMUP) return [t, t / WARMUP];
  const p = (t - WARMUP) / (1 - WARMUP);
  return [t, 0.5 * (1 + Math.cos(Math.PI * p)) * 0.9 + 0.1];
});

const wsd: Array<[number, number]> = Array.from({ length: N + 1 }, (_, i) => {
  const t = i / N;
  if (t < WARMUP) return [t, t / WARMUP];
  if (t < 0.8) return [t, 1];
  return [t, 1 - ((t - 0.8) / 0.2) * 0.95];
});

export function LrScheduleFigure() {
  return (
    <Figure caption="The two learning-rate schedules you'll meet in every technical report: warmup + cosine decay, and warmup–stable–decay (WSD), whose long flat stretch lets labs branch models off mid-run checkpoints.">
      <svg viewBox="0 0 560 220" className="w-full max-w-xl">
        <line x1={50} y1={180} x2={530} y2={180} stroke="currentColor" strokeOpacity={0.3} />
        <line x1={50} y1={180} x2={50} y2={30} stroke="currentColor" strokeOpacity={0.3} />
        <text x={290} y={205} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7}>
          training progress (tokens)
        </text>
        <text x={24} y={105} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.7} transform="rotate(-90 24 105)">
          learning rate
        </text>
        <path d={path(cosine)} fill="none" stroke={ACCENT.blue} strokeWidth={2.5} />
        <path d={path(wsd)} fill="none" stroke={ACCENT.orange} strokeWidth={2.5} />
        <text x={200} y={95} fontSize={12} fill={ACCENT.blue}>
          cosine
        </text>
        <text x={330} y={32} fontSize={12} fill={ACCENT.orange}>
          WSD
        </text>
        <text x={62} y={30} fontSize={11} fill="currentColor" opacity={0.6}>
          ← warmup
        </text>
      </svg>
    </Figure>
  );
}
