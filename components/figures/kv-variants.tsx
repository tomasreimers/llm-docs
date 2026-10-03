import { Figure, ink } from './figure';

// Honest math, using Llama 3 70B's real shape: 80 layers, head_dim 128,
// fp16 (2 bytes). Per token: 2 (K and V) × layers × kv_heads × head_dim × 2 B.
// MLA modeled as DeepSeek's 576-dim latent per token per layer.
const LAYERS = 80;
const HEAD_DIM = 128;
const BYTES = 2;
const perToken = (kvHeads: number) => 2 * LAYERS * kvHeads * HEAD_DIM * BYTES;
const CTX = 131072; // 128K tokens

const ROWS: Array<{ label: string; detail: string; bytes: number }> = [
  { label: 'MHA', detail: '64 KV heads — one per query head (the Chapter 3 default)', bytes: perToken(64) },
  { label: 'GQA', detail: '8 KV heads, each shared by 8 query heads (Llama 3)', bytes: perToken(8) },
  { label: 'MQA', detail: '1 KV head shared by all 64 query heads', bytes: perToken(1) },
  { label: 'MLA', detail: 'one 576-dim compressed latent per token (DeepSeek)', bytes: LAYERS * 576 * BYTES },
];

const fmtPerToken = (b: number) => (b >= 1 << 20 ? `${(b / (1 << 20)).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);
const fmtAtCtx = (b: number) => `${((b * CTX) / 2 ** 30).toFixed(0)} GB`;

export function KvVariantsFigure() {
  const max = ROWS[0].bytes;
  return (
    <Figure caption="KV cache per token of context, computed for Llama 3 70B's real shape (80 layers, head dim 128, fp16). The progression MHA → GQA → MQA/MLA is the industry whittling down its most expensive data structure: at a 128K-token context, vanilla attention would need a third of a terabyte per sequence.">
      <div className="w-full max-w-xl font-mono text-sm">
        {ROWS.map((r) => (
          <div key={r.label} className="mb-3">
            <div className="mb-1 flex justify-between gap-2 text-xs">
              <span className="min-w-0">
                <span className="font-bold">{r.label}</span>
                <span className="ml-2 opacity-60">{r.detail}</span>
              </span>
              <span className="whitespace-nowrap opacity-70">
                {fmtPerToken(r.bytes)}/tok · {fmtAtCtx(r.bytes)} @ 128K
              </span>
            </div>
            <div className="h-4 w-full rounded-sm bg-gray-500/10">
              <div
                className="h-4 rounded-sm"
                style={{ width: `${(r.bytes / max) * 100}%`, background: ink(60), minWidth: 6 }}
              />
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}
