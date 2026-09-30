import { ACCENT, Figure } from './figure';

function column(n: number, x: number, top: number, bottom: number) {
  const step = (bottom - top) / (n - 1);
  return Array.from({ length: n }, (_, i) => ({ x, y: top + i * step }));
}

export function MlpFigure() {
  const inputs = column(9, 80, 40, 240);
  const hidden = column(7, 320, 55, 225);
  const outputs = column(5, 560, 80, 200);

  return (
    <Figure caption="An MLP for MNIST: 784 pixels in, 10 digit scores out. Every edge is one learned weight; the hidden layer's ReLU is what makes the whole thing more than a single matrix.">
      <svg viewBox="0 0 640 310" className="w-full max-w-xl">
        {inputs.map((a) =>
          hidden.map((b) => (
            <line
              key={`${a.y}-${b.y}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="currentColor"
              strokeOpacity={0.08}
            />
          )),
        )}
        {hidden.map((a) =>
          outputs.map((b) => (
            <line
              key={`${a.y}-${b.y}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="currentColor"
              strokeOpacity={0.08}
            />
          )),
        )}
        {inputs.map((p) => (
          <circle key={p.y} cx={p.x} cy={p.y} r={8} fill={ACCENT.blue} fillOpacity={0.85} />
        ))}
        {hidden.map((p) => (
          <circle key={p.y} cx={p.x} cy={p.y} r={8} fill={ACCENT.purple} fillOpacity={0.85} />
        ))}
        {outputs.map((p) => (
          <circle key={p.y} cx={p.x} cy={p.y} r={8} fill={ACCENT.green} fillOpacity={0.85} />
        ))}
        <text x={200} y={28} textAnchor="middle" fontSize={13} fill="currentColor" opacity={0.7}>
          W₁ (784 × 512)
        </text>
        <text x={440} y={28} textAnchor="middle" fontSize={13} fill="currentColor" opacity={0.7}>
          W₂ (512 × 10)
        </text>
        <text x={80} y={268} textAnchor="middle" fontSize={13} fill="currentColor">
          input
        </text>
        <text x={80} y={286} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.6}>
          784 pixels (⋮)
        </text>
        <text x={320} y={268} textAnchor="middle" fontSize={13} fill="currentColor">
          hidden
        </text>
        <text x={320} y={286} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.6}>
          512 units, ReLU (⋮)
        </text>
        <text x={560} y={268} textAnchor="middle" fontSize={13} fill="currentColor">
          output
        </text>
        <text x={560} y={286} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.6}>
          10 digits, softmax
        </text>
      </svg>
    </Figure>
  );
}
