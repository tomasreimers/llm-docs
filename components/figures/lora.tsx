import { Figure } from './figure';

// LoRA: the frozen weight matrix plus a trainable low-rank bypass.
// Numbers for Llama 3 8B's shape (d = 4096), rank r = 16.
export function LoraFigure() {
  return (
    <Figure caption="LoRA on one weight matrix, with Llama 3 8B's real shape: the 4096×4096 matrix W (16.8M parameters) stays frozen; a bypass of two skinny matrices — down to rank 16, back up — is all that trains: 131K parameters, 0.8% of the matrix it adapts. At serving time the bypass can be merged into W (zero added latency) or kept separate and hot-swapped per task.">
      <svg viewBox="0 0 640 260" className="w-full max-w-xl font-mono">
        <defs>
          <marker id="lora-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.55} />
          </marker>
        </defs>

        {/* input */}
        <text x={40} y={134} textAnchor="middle" fontSize={13} fill="currentColor">
          x
        </text>
        <line x1={58} y1={130} x2={96} y2={130} stroke="currentColor" strokeOpacity={0.5} />
        {/* split */}
        <line x1={96} y1={130} x2={116} y2={60} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#lora-arrow)" />
        <line x1={96} y1={130} x2={130} y2={186} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#lora-arrow)" />

        {/* frozen W */}
        <rect x={122} y={28} width={180} height={92} rx={5} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.55} strokeDasharray="6 4" />
        <text x={212} y={62} textAnchor="middle" fontSize={14} fill="currentColor">
          W (frozen)
        </text>
        <text x={212} y={86} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.6}>
          4096 × 4096 · 16.8M params
        </text>
        <text x={212} y={102} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.6}>
          no gradients · no optimizer state
        </text>

        {/* low-rank bypass */}
        <rect x={136} y={162} width={64} height={48} rx={5} fill="currentColor" fillOpacity={0.14} stroke="currentColor" strokeOpacity={0.8} />
        <text x={168} y={183} textAnchor="middle" fontSize={12} fill="currentColor">
          A
        </text>
        <text x={168} y={199} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.65}>
          4096 × 16
        </text>
        <line x1={200} y1={186} x2={230} y2={186} stroke="currentColor" strokeOpacity={0.6} markerEnd="url(#lora-arrow)" />
        <rect x={236} y={162} width={64} height={48} rx={5} fill="currentColor" fillOpacity={0.14} stroke="currentColor" strokeOpacity={0.8} />
        <text x={268} y={183} textAnchor="middle" fontSize={12} fill="currentColor">
          B
        </text>
        <text x={268} y={199} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.65}>
          16 × 4096
        </text>
        <text x={218} y={236} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.75}>
          trainable: 131K params (0.8% of W)
        </text>

        {/* merge */}
        <line x1={308} y1={60} x2={346} y2={120} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#lora-arrow)" />
        <line x1={300} y1={186} x2={344} y2={138} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#lora-arrow)" />
        <circle cx={356} cy={130} r={13} fill="currentColor" fillOpacity={0.07} stroke="currentColor" strokeOpacity={0.6} />
        <text x={356} y={135} textAnchor="middle" fontSize={14} fill="currentColor">
          +
        </text>
        <line x1={369} y1={130} x2={420} y2={130} stroke="currentColor" strokeOpacity={0.5} markerEnd="url(#lora-arrow)" />
        <text x={452} y={134} textAnchor="middle" fontSize={13} fill="currentColor">
          out
        </text>
        <text x={520} y={60} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.65}>
          out = Wx + BAx
        </text>
        <text x={520} y={78} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={0.65}>
          ΔW = BA, rank ≤ 16
        </text>
      </svg>
    </Figure>
  );
}
