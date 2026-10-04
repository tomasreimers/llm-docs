import { Figure } from './figure';

// The agent loop: a model that can only emit tokens, a runtime that
// executes some of them, and a context window accumulating the history.
export function AgentLoopFigure() {
  return (
    <Figure caption="An agent is a while loop. The model reads the context and emits tokens; if they parse as an action, the runtime — your code, holding all actual privileges — executes it and appends the observation to the context; the model reads again. Exit when the tokens are a final answer instead. Everything an agent 'does' passes through the runtime's judgment; everything it 'remembers' must fit in the context.">
      <svg viewBox="0 0 640 270" className="w-full max-w-xl font-mono">
        <defs>
          <marker id="al-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity={0.6} />
          </marker>
        </defs>

        {/* context */}
        <rect x={30} y={95} width={150} height={80} rx={5} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.55} />
        <text x={105} y={125} textAnchor="middle" fontSize={13} fill="currentColor">
          context
        </text>
        <text x={105} y={145} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.6}>
          task + transcript so far
        </text>
        <text x={105} y={160} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.6}>
          (the agent&apos;s entire memory)
        </text>

        {/* model */}
        <rect x={258} y={100} width={150} height={70} rx={5} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeOpacity={0.7} />
        <text x={333} y={130} textAnchor="middle" fontSize={13} fill="currentColor">
          model
        </text>
        <text x={333} y={150} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.6}>
          emits tokens, nothing else
        </text>

        {/* runtime */}
        <rect x={470} y={30} width={150} height={74} rx={5} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.55} />
        <text x={545} y={58} textAnchor="middle" fontSize={13} fill="currentColor">
          runtime
        </text>
        <text x={545} y={78} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.6}>
          your code · all privileges
        </text>
        <text x={545} y={92} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.6}>
          tools, APIs, databases
        </text>

        {/* done */}
        <rect x={470} y={190} width={150} height={52} rx={5} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeDasharray="5 4" />
        <text x={545} y={214} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.8}>
          final answer
        </text>
        <text x={545} y={230} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.55}>
          loop exits
        </text>

        {/* arrows */}
        <line x1={180} y1={135} x2={264} y2={135} stroke="currentColor" strokeOpacity={0.6} markerEnd="url(#al-arrow)" />
        <text x={222} y={125} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.65}>
          read
        </text>

        <line x1={408} y1={115} x2={464} y2={78} stroke="currentColor" strokeOpacity={0.6} markerEnd="url(#al-arrow)" />
        <text x={458} y={70} textAnchor="end" fontSize={9.5} fill="currentColor" opacity={0.65}>
          action: tool call
        </text>

        <path d="M 470 60 C 300 30, 130 45, 100 89" fill="none" stroke="currentColor" strokeOpacity={0.6} strokeDasharray="5 4" markerEnd="url(#al-arrow)" />
        <text x={268} y={40} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.65}>
          observation appended → loop
        </text>

        <line x1={408} y1={155} x2={464} y2={200} stroke="currentColor" strokeOpacity={0.45} markerEnd="url(#al-arrow)" />
        <text x={422} y={192} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.6}>
          or: done
        </text>
      </svg>
    </Figure>
  );
}
