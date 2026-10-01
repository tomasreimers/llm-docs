import { Figure } from './figure';

function Box({
  x,
  y,
  w,
  label,
  sub,
  filled,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub?: string;
  filled?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={46} rx={6} fill={filled ? 'currentColor' : 'none'} fillOpacity={filled ? 0.07 : 0} stroke="currentColor" strokeOpacity={filled ? 0.7 : 0.5} />
      <text x={x + w / 2} y={y + (sub ? 20 : 28)} textAnchor="middle" fontSize={13} fill="currentColor">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + 36} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.6}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ d, label, lx, ly, dashed }: { d: string; label?: string; lx?: number; ly?: number; dashed?: boolean }) {
  return (
    <g>
      <path d={d} fill="none" stroke="currentColor" strokeOpacity={dashed ? 0.7 : 0.5} strokeDasharray={dashed ? '5 4' : undefined} markerEnd="url(#rlhf-arrow)" />
      {label && (
        <text x={lx} y={ly} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>
          {label}
        </text>
      )}
    </g>
  );
}

export function RlhfPipelineFigure() {
  return (
    <Figure caption="The classical post-training pipeline: demonstrations teach the format (SFT), comparisons teach judgment (reward model), and RL optimizes against the learned reward — with a KL leash back to where it started.">
      <svg viewBox="0 0 640 260" className="w-full max-w-2xl">
        <defs>
          <marker id="rlhf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.6} />
          </marker>
        </defs>
        <Box x={20} y={30} w={130} label="base model" sub="document completer" />
        <Box x={250} y={30} w={130} label="SFT model" sub="assistant format" filled />
        <Box x={480} y={30} w={140} label="reward model" sub="compressed judgment" filled />
        <Box x={250} y={180} w={130} label="final model" sub="RL (PPO)" filled />
        <Arrow d="M 150 53 L 243 53" label="demonstrations" lx={197} ly={43} />
        <Arrow d="M 380 53 L 473 53" label="human preferences" lx={427} ly={43} />
        <Arrow d="M 315 76 L 315 173" label="samples, gets scored" lx={378} ly={130} />
        <Arrow d="M 480 76 C 440 120, 420 150, 387 185" dashed />
        <Arrow d="M 250 192 C 180 180, 170 120, 233 80" label="KL leash" lx={168} ly={140} />
      </svg>
    </Figure>
  );
}
