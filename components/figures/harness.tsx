import { Figure } from './figure';

// The harness: everything outside the frozen weights that assembles the
// context, runs the sampled tokens, and loops.
export function HarnessFigure() {
  return (
    <Figure caption="One turn through a harness. The 'conversation' the user sees is an illusion the harness maintains: it assembles the system prompt, the transcript, tool results, and any retrieved documents into one flat token sequence (Chapter 8's chat template), hands it to the frozen model, samples from the distribution (Chapter 12), and then decides what the tokens mean — text to stream, or a tool call to execute. Whatever happens is appended, and the loop runs again.">
      <svg viewBox="0 0 680 300" className="w-full max-w-xl font-mono">
        <defs>
          <marker id="hn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.6} />
          </marker>
        </defs>

        {/* sources, stacked */}
        {[
          { y: 28, label: 'system prompt', sub: 'the standing orders' },
          { y: 92, label: 'transcript', sub: 'every turn so far' },
          { y: 156, label: 'tool results', sub: 'what the runtime saw' },
          { y: 220, label: 'retrieved docs', sub: 'fetched per query' },
        ].map((s) => (
          <g key={s.label}>
            <rect x={16} y={s.y} width={138} height={48} rx={5} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.5} />
            <text x={85} y={s.y + 21} textAnchor="middle" fontSize={11} fill="currentColor">
              {s.label}
            </text>
            <text x={85} y={s.y + 36} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.6}>
              {s.sub}
            </text>
            <line x1={154} y1={s.y + 24} x2={198} y2={148} stroke="currentColor" strokeOpacity={0.45} markerEnd="url(#hn-arrow)" />
          </g>
        ))}

        {/* context window */}
        <rect x={202} y={108} width={126} height={80} rx={5} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.6} />
        <text x={265} y={138} textAnchor="middle" fontSize={12} fill="currentColor">
          context
        </text>
        <text x={265} y={156} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.6}>
          one flat token
        </text>
        <text x={265} y={168} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.6}>
          sequence
        </text>

        {/* model */}
        <rect x={368} y={108} width={112} height={80} rx={5} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeOpacity={0.7} />
        <text x={424} y={142} textAnchor="middle" fontSize={12} fill="currentColor">
          model
        </text>
        <text x={424} y={160} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.6}>
          frozen weights
        </text>

        {/* runtime */}
        <rect x={522} y={96} width={142} height={104} rx={5} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.55} />
        <text x={593} y={122} textAnchor="middle" fontSize={12} fill="currentColor">
          runtime
        </text>
        <text x={593} y={142} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.6}>
          stream text to user
        </text>
        <text x={593} y={156} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.6}>
          execute tool calls
        </text>
        <text x={593} y={170} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.6}>
          decide when to stop
        </text>

        {/* arrows across */}
        <line x1={328} y1={148} x2={362} y2={148} stroke="currentColor" strokeOpacity={0.6} markerEnd="url(#hn-arrow)" />
        <line x1={480} y1={148} x2={516} y2={148} stroke="currentColor" strokeOpacity={0.6} markerEnd="url(#hn-arrow)" />
        <text x={498} y={136} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.65}>
          tokens
        </text>
        <text x={498} y={164} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.55}>
          (Ch. 12)
        </text>

        {/* return loop */}
        <path d="M 593 90 C 520 14, 260 10, 124 84" fill="none" stroke="currentColor" strokeOpacity={0.55} strokeDasharray="5 4" markerEnd="url(#hn-arrow)" />
        <text x={370} y={24} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.65}>
          results and new turns appended → loop
        </text>
      </svg>
    </Figure>
  );
}
