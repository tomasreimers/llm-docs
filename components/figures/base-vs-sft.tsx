import { Figure } from './figure';

// The same prompt, before and after SFT. The base model is a document
// completer: a lone question most plausibly continues as a quiz. SFT
// reframes the same weights as a participant in a dialogue.
function Panel({ title, prompt, completion }: { title: string; prompt: string; completion: string[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="mb-2 text-[11px] uppercase tracking-wider opacity-60">{title}</div>
      <div className="flex grow flex-col gap-1 rounded-sm border border-current/25 p-4 font-mono text-[12.5px] leading-relaxed">
        <div className="opacity-90">{prompt}</div>
        {completion.map((line, i) => (
          <div key={i} className="opacity-55">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BaseVsSftFigure() {
  return (
    <Figure caption="One prompt, same weights, before and after post-training begins. The base model continues the document — a lone quiz question most plausibly belongs to a list of quiz questions. The SFT'd model has been shown thousands of transcripts in which text like this is a conversation, and it plays the assistant.">
      <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
        <Panel
          title="base model — completes the document"
          prompt="What's the capital of France?"
          completion={[
            "What's the capital of Germany?",
            "What's the capital of Italy?",
            "What's the capital of Spain?",
            'Answers on page 12.',
          ]}
        />
        <Panel
          title="after SFT — plays the assistant"
          prompt="What's the capital of France?"
          completion={['The capital of France is Paris.']}
        />
      </div>
    </Figure>
  );
}
