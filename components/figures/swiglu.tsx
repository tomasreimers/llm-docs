import { Figure } from './figure';

// The MLP, before and after SwiGLU. Activation curves are the real
// functions, computed below: ReLU(x) = max(0, x); SiLU(x) = x·σ(x).
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const silu = (x: number) => x * sigmoid(x);
const relu = (x: number) => Math.max(0, x);

// Draw f over x ∈ [−3, 3] inside a node centered at (cx, cy).
function curvePath(f: (x: number) => number, cx: number, cy: number) {
  const xs = 6.5; // px per unit x
  const ys = 7.5; // px per unit y
  const pts: string[] = [];
  for (let x = -3; x <= 3.001; x += 0.2) {
    pts.push(`${pts.length ? 'L' : 'M'} ${(cx + x * xs).toFixed(1)} ${(cy - f(x) * ys + 8).toFixed(1)}`);
  }
  return pts.join(' ');
}

function ActNode({ cx, cy, f, label }: { cx: number; cy: number; f: (x: number) => number; label: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={24} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.55} />
      <line x1={cx - 20} y1={cy + 8} x2={cx + 20} y2={cy + 8} stroke="currentColor" strokeOpacity={0.2} />
      <path d={curvePath(f, cx, cy)} fill="none" stroke="currentColor" strokeOpacity={0.9} strokeWidth={1.8} />
      <text x={cx} y={cy + 40} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>
        {label}
      </text>
    </g>
  );
}

function Box({ cx, cy, w = 88, label, dims }: { cx: number; cy: number; w?: number; label: string; dims?: string }) {
  return (
    <g>
      <rect x={cx - w / 2} y={cy - 17} width={w} height={34} rx={4} fill="currentColor" fillOpacity={0.07} stroke="currentColor" strokeOpacity={0.55} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fill="currentColor">
        {label}
      </text>
      {dims && (
        <text x={cx} y={cy + 32} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.55}>
          {dims}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#sg-arrow)" />;
}

export function SwigluFigure() {
  return (
    <Figure caption="The MLP, before and after. GPT-2's version: expand, clip negatives to zero (ReLU — a hard gate), contract. SwiGLU's version: the expansion produces two projections; the gate side passes through SiLU (a smooth ramp that dips slightly below zero — the curves drawn are the real functions) and multiplies the content side elementwise, deciding per dimension how much gets through. The two projections are why the expansion shrinks from 4d to ~3.5d: same total parameters, one extra decision.">
      <svg viewBox="0 0 640 332" className="w-full max-w-xl font-mono">
        <defs>
          <marker id="sg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.55} />
          </marker>
        </defs>

        {/* ---- ReLU MLP ---- */}
        <text x={20} y={22} fontSize={11.5} fill="currentColor" opacity={0.8}>
          GPT-2&apos;s MLP: ReLU
        </text>
        <Box cx={55} cy={66} w={56} label="x" />
        <Arrow x1={83} y1={66} x2={134} y2={66} />
        <Box cx={182} cy={66} label="expand" dims="768 → 3072" />
        <Arrow x1={226} y1={66} x2={266} y2={66} />
        <ActNode cx={296} cy={66} f={relu} label="ReLU: negatives → 0" />
        <Arrow x1={320} y1={66} x2={364} y2={66} />
        <Box cx={412} cy={66} label="contract" dims="3072 → 768" />
        <Arrow x1={456} y1={66} x2={500} y2={66} />
        <Box cx={532} cy={66} w={56} label="out" />

        {/* ---- SwiGLU MLP ---- */}
        <text x={20} y={158} fontSize={11.5} fill="currentColor" opacity={0.8}>
          The modern MLP: SwiGLU
        </text>
        <Box cx={55} cy={238} w={56} label="x" />
        {/* split */}
        <Arrow x1={83} y1={230} x2={134} y2={200} />
        <Arrow x1={83} y1={246} x2={134} y2={276} />
        <Box cx={182} cy={198} label="content" dims="768 → 2688" />
        <Box cx={182} cy={278} label="gate" dims="768 → 2688" />
        <Arrow x1={226} y1={278} x2={266} y2={278} />
        <ActNode cx={296} cy={278} f={silu} label="SiLU: a smooth ramp" />
        {/* merge at elementwise product */}
        <Arrow x1={226} y1={198} x2={352} y2={232} />
        <Arrow x1={320} y1={272} x2={352} y2={244} />
        <circle cx={364} cy={238} r={13} fill="currentColor" fillOpacity={0.07} stroke="currentColor" strokeOpacity={0.6} />
        <text x={364} y={243} textAnchor="middle" fontSize={13} fill="currentColor">
          ⊙
        </text>
        <text x={364} y={214} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.6}>
          elementwise ×
        </text>
        <Arrow x1={377} y1={238} x2={420} y2={238} />
        <Box cx={468} cy={238} label="contract" dims="2688 → 768" />
        <Arrow x1={512} y1={238} x2={548} y2={238} />
        <Box cx={580} cy={238} w={56} label="out" />
      </svg>
    </Figure>
  );
}
