'use client';

import { useEffect, useState } from 'react';

import { Figure, ink } from './figure';

// Honest math: every point is computed from Kaplan et al.'s fitted
// compute law L(C) = (C_c / C)^0.050 with C_c = 2.3e8 PF-days ≈ 1.99e28
// FLOPs, plus a small fixed "measurement" jitter so it reads as data.
const ALPHA = 0.05;
const CC = 1.99e28;
const lossAt = (logC: number) => Math.pow(CC / Math.pow(10, logC), ALPHA);

// cheap runs (fit set) and expensive runs (the bet)
const RUNS = [
  { logC: 18.0, j: 0.012 },
  { logC: 18.8, j: -0.01 },
  { logC: 19.6, j: 0.006 },
  { logC: 20.3, j: -0.008 },
  { logC: 21.0, j: 0.01 },
];
const BIG = [
  { logC: 23.5, j: -0.006, label: 'GPT-3 scale' },
  { logC: 25.3, j: 0.004, label: 'frontier' },
];
const pt = (p: { logC: number; j: number }) => ({ logC: p.logC, loss: lossAt(p.logC) * (1 + p.j) });

// log view: x over log10(C) ∈ [18, 26], y over log10(loss) ∈ [0.09, 0.56]
const LX = (logC: number) => 70 + ((logC - 18) / 8) * 460;
const LY = (loss: number) => 270 - ((Math.log10(loss) - 0.09) / 0.47) * 245;
// linear view: x over C ∈ [0, 2e25], y over loss ∈ [1.3, 3.4]
const NX = (logC: number) => 70 + (Math.pow(10, logC) / 2e25) * 460;
const NY = (loss: number) => 270 - ((loss - 1.3) / 2.1) * 245;

const PHASE_MS = 3800;
const STEP_TEXT = [
  'plotted on ordinary axes, the experiments are unreadable — every affordable run is crushed against zero',
  'log both axes, and the same points form a straight line: a power law',
  'fit the line on the runs you can afford…',
  '…then spend the millions: the big runs land where the line said they would',
];
const N = STEP_TEXT.length;

function curvePath(xf: (l: number) => number, yf: (loss: number) => number, from: number, to: number) {
  const pts: string[] = [];
  for (let l = from; l <= to + 1e-9; l += 0.1) {
    pts.push(`${pts.length ? 'L' : 'M'} ${xf(l).toFixed(1)} ${yf(lossAt(l)).toFixed(1)}`);
  }
  return pts.join(' ');
}

export function ScalingLawsFigure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % (N + 1)), PHASE_MS);
    return () => window.clearInterval(id);
  }, []);

  const s = Math.min(tick, N - 1);
  const logView = s >= 1;

  return (
    <Figure caption="The discovery that reorganized an industry: loss falls as a power law in training compute — a straight line on log-log axes — steady across eight orders of magnitude. Fit the line on cheap runs and the expensive run stops being a gamble. Every point here is computed from Kaplan et al.'s fitted compute law.">
      <div className="flex w-full flex-col items-center gap-2 font-mono text-[11px]">
        <svg viewBox="0 0 560 320" className="w-full max-w-xl">
          {/* ---------- linear view ---------- */}
          <g opacity={logView ? 0 : 1} style={{ transition: 'opacity 500ms' }}>
            {[0, 0.5e25, 1e25, 1.5e25, 2e25].map((c, i) => (
              <g key={i}>
                <line x1={70 + (c / 2e25) * 460} y1={25} x2={70 + (c / 2e25) * 460} y2={270} stroke="currentColor" strokeOpacity={0.08} />
                <text x={70 + (c / 2e25) * 460} y={288} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
                  {i === 0 ? '0' : `${i * 0.5}e25`}
                </text>
              </g>
            ))}
            {[1.5, 2.0, 2.5, 3.0].map((l) => (
              <g key={l}>
                <line x1={70} y1={NY(l)} x2={530} y2={NY(l)} stroke="currentColor" strokeOpacity={0.08} />
                <text x={58} y={NY(l) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>
                  {l.toFixed(1)}
                </text>
              </g>
            ))}
            <path d={curvePath(NX, NY, 18, 25.3)} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.5} />
            {[...RUNS, ...BIG].map((p, i) => {
              const { logC, loss } = pt(p);
              return <circle key={i} cx={NX(logC)} cy={NY(loss)} r={4.5} fill="currentColor" fillOpacity={0.85} />;
            })}
            <text x={100} y={60} fontSize={11} fill="currentColor" opacity={0.6}>
              ← 5 training runs, all here
            </text>
          </g>

          {/* ---------- log-log view ---------- */}
          <g opacity={logView ? 1 : 0} style={{ transition: 'opacity 500ms' }}>
            {[18, 20, 22, 24, 26].map((d) => (
              <g key={d}>
                <line x1={LX(d)} y1={25} x2={LX(d)} y2={270} stroke="currentColor" strokeOpacity={0.08} />
                <text x={LX(d)} y={288} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
                  10{String(d).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('')}
                </text>
              </g>
            ))}
            {[1.5, 2.0, 2.5, 3.0].map((l) => (
              <g key={l}>
                <line x1={70} y1={LY(l)} x2={530} y2={LY(l)} stroke="currentColor" strokeOpacity={0.08} />
                <text x={58} y={LY(l) + 4} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>
                  {l.toFixed(1)}
                </text>
              </g>
            ))}
            {/* full line (step 1) / fit + extrapolation (steps 2-3) */}
            <path
              d={curvePath(LX, LY, 18, 26)}
              fill="none"
              stroke="currentColor"
              strokeOpacity={s === 1 ? 0.7 : 0}
              strokeWidth={2}
              style={{ transition: 'stroke-opacity 500ms' }}
            />
            <path
              d={curvePath(LX, LY, 18, 21)}
              fill="none"
              stroke="currentColor"
              strokeOpacity={s >= 2 ? 0.85 : 0}
              strokeWidth={2.5}
              style={{ transition: 'stroke-opacity 500ms' }}
            />
            <path
              d={curvePath(LX, LY, 21, 26)}
              fill="none"
              stroke="currentColor"
              strokeOpacity={s >= 2 ? 0.55 : 0}
              strokeWidth={1.8}
              strokeDasharray="6 5"
              style={{ transition: 'stroke-opacity 500ms' }}
            />
            {s >= 2 && (
              <text x={LX(19.5)} y={LY(lossAt(19.5)) - 16} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.65}>
                {s === 2 ? 'the fit' : ''}
              </text>
            )}
            {RUNS.map((p, i) => {
              const { logC, loss } = pt(p);
              return <circle key={i} cx={LX(logC)} cy={LY(loss)} r={4.5} fill="currentColor" fillOpacity={0.85} />;
            })}
            {BIG.map((p, i) => {
              const { logC, loss } = pt(p);
              const show = s === 1 || s === 3;
              return (
                <g key={i} opacity={show ? 1 : 0} style={{ transition: 'opacity 500ms' }}>
                  <circle cx={LX(logC)} cy={LY(loss)} r={5.5} fill="none" stroke="currentColor" strokeWidth={2} />
                  <text x={LX(logC)} y={LY(loss) - 20} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.8}>
                    {p.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* shared axis titles */}
          <text x={300} y={312} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.75}>
            training compute (FLOPs{logView ? ', log scale' : ''})
          </text>
          <text x={20} y={148} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.75} transform="rotate(-90 20 148)">
            loss{logView ? ' (log)' : ''}
          </text>
        </svg>

        <div className="flex h-9 max-w-xl items-center justify-center text-center leading-tight opacity-80">
          {STEP_TEXT[s]}
        </div>

        <div className="flex w-full max-w-xl items-center justify-center gap-1.5">
          {STEP_TEXT.map((_, i) => (
            <button
              key={i}
              aria-label={`Jump to step ${i + 1}`}
              onClick={() => setTick(i)}
              className="h-1.5 w-7 overflow-hidden rounded-full"
              style={{ background: ink(15) }}
            >
              <div
                key={`${i}-${i === s ? s : 'static'}`}
                className="h-full rounded-full"
                style={{
                  background: 'currentColor',
                  opacity: 0.65,
                  width: i < s ? '100%' : i > s ? '0%' : undefined,
                  animation: i === s ? `gd-fill ${PHASE_MS}ms linear forwards` : undefined,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </Figure>
  );
}
