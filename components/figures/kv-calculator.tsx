'use client';

import { useState } from 'react';

import { Figure, ink } from './figure';

// 70B-class dense model with GQA: 80 layers × 8 KV heads × 128 head dim
const LAYERS = 80;
const KV_HEADS = 8;
const HEAD_DIM = 128;
const PARAMS = 70e9;
const H100_GB = 80;

function fmtTokens(t: number) {
  return t >= 1024 * 1024 ? '1M' : t >= 1024 ? `${t / 1024}K` : `${t}`;
}

export function KvCalculatorFigure() {
  const [ctxPow, setCtxPow] = useState(17); // 2^17 = 128K
  const [batch, setBatch] = useState(8);
  const [bits, setBits] = useState(16);

  const tokens = 2 ** ctxPow;
  const kvPerTokenB = 2 * LAYERS * KV_HEADS * HEAD_DIM * (bits / 8);
  const kvGB = (tokens * batch * kvPerTokenB) / 1e9;
  const weightsGB = (PARAMS * (bits / 8)) / 1e9;
  const totalGB = kvGB + weightsGB;
  const gpus = Math.max(1, Math.ceil(totalGB / H100_GB));
  const scaleMax = Math.max(totalGB * 1.15, 200);

  return (
    <Figure caption="Where inference memory actually goes, for a 70B-class GQA model. Drag the sliders: context length and concurrency inflate the KV cache until it dwarfs the weights — and precision shrinks both.">
      <div className="w-full max-w-xl rounded-lg border border-neutral-200/70 p-4 text-sm dark:border-neutral-100/10">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs opacity-70">
              context length: <b>{fmtTokens(tokens)} tokens</b>
            </span>
            <input
              type="range"
              min={10}
              max={20}
              value={ctxPow}
              onChange={(e) => setCtxPow(Number(e.target.value))}
              className="w-full"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs opacity-70">
              concurrent requests: <b>{batch}</b>
            </span>
            <input
              type="range"
              min={1}
              max={64}
              value={batch}
              onChange={(e) => setBatch(Number(e.target.value))}
              className="w-full"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs opacity-70">
              precision: <b>{bits}-bit</b>
            </span>
            <input
              type="range"
              min={0}
              max={2}
              value={[4, 8, 16].indexOf(bits)}
              onChange={(e) => setBits([4, 8, 16][Number(e.target.value)])}
              className="w-full"
            />
          </label>
        </div>
        <div className="mb-1 flex h-8 w-full overflow-hidden rounded-sm bg-gray-500/10">
          <div
            className="flex h-8 items-center justify-center text-xs text-white dark:text-black"
            style={{ width: `${(weightsGB / scaleMax) * 100}%`, background: ink(80) }}
          >
            weights
          </div>
          <div
            className="flex h-8 items-center justify-center text-xs"
            style={{ width: `${(kvGB / scaleMax) * 100}%`, background: ink(30), minWidth: 2 }}
          >
            {kvGB / scaleMax > 0.12 ? 'KV cache' : ''}
          </div>
        </div>
        <div className="flex justify-between font-mono text-xs">
          <span className="opacity-90">weights {weightsGB.toFixed(0)} GB</span>
          <span className="opacity-60">KV {kvGB.toFixed(1)} GB</span>
          <span>
            total {totalGB.toFixed(0)} GB ≈ {gpus} × H100
          </span>
        </div>
      </div>
    </Figure>
  );
}
