import { type ReactNode } from 'react';

// House style: "ink on paper" — figures are drawn in currentColor at varying
// opacities (1.0 emphasis, ~0.8 normal, ~0.5 secondary, ~0.12 hairlines) so
// they read like the surrounding text and adapt to dark mode. Series are
// distinguished by opacity and dash patterns, not hue. For translucent fills
// in HTML (non-SVG) figures, use `ink(percent)`.
export const ink = (percent: number) =>
  `color-mix(in srgb, currentColor ${percent}%, transparent)`;

export function Figure({
  caption,
  children,
}: {
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="mt-6 mb-2 flex flex-col items-center">
      <div className="flex w-full justify-center overflow-x-auto">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 max-w-xl text-center text-sm text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
