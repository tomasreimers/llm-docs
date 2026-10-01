import { Figure, ink } from './figure';

const STAGES: Array<{ label: string; note: string; pct: number }> = [
  { label: 'raw crawl', note: 'petabytes of HTML', pct: 100 },
  { label: 'extracted text', note: 'boilerplate stripped', pct: 55 },
  { label: 'filtered', note: 'language + quality classifiers', pct: 28 },
  { label: 'deduplicated', note: 'the web is mostly copies', pct: 16 },
  { label: 'final mix', note: '~15T tokens, composed by hand', pct: 11 },
];

export function DataFunnelFigure() {
  return (
    <Figure caption="The pre-training data funnel, proportions after FineWeb: most of the crawl doesn't survive. The curation decisions in this funnel are a lab's most guarded asset.">
      <div className="w-full max-w-xl text-sm">
        {STAGES.map((s, i) => (
          <div key={s.label} className="mb-2 flex items-center">
            <div className="w-36 shrink-0 text-right">
              <div className="font-medium">{s.label}</div>
            </div>
            <div className="mx-3 h-7 grow">
              <div
                className="h-7 rounded-sm"
                style={{
                  width: `${s.pct}%`,
                  background: ink(35 + (i / (STAGES.length - 1)) * 50),
                  minWidth: 8,
                }}
              />
            </div>
            <div className="w-56 shrink-0 text-xs opacity-60">{s.note}</div>
          </div>
        ))}
      </div>
    </Figure>
  );
}
