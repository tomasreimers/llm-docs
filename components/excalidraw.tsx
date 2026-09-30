'use client';

import { type ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { useTheme } from 'nextra-theme-docs';
import { useEffect, useRef } from 'react';

// TODO, figure out if you can move to server-side rendering; right now excalidraw
// can only be imported on the client (which is a shame b/c this is a perfect component
// to move to server rendering) but it seems as if they're actively working towards
// server-side rendering (https://github.com/excalidraw/excalidraw/pull/443).
//
// For example, here is an example in the repo rendering node:
//
// https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/index-node.ts
//
// However, because excalidraw is webpacked, and that single webpacked file relies on
// document., there is no file that can be imported on the server (there is only one
// file, and it requires document.) So to use the server example, one would have to
// recompile excalidraw, and I would rather just wait for them to add support for this.
//
// The other lib to watch is https://www.npmjs.com/package/@excalidraw/utils
// But it also webpacks one export that depends on document -_-
export function Excalidraw({
  contents,
  widthClass,
}: {
  contents: ExcalidrawInitialDataState;
  widthClass: string;
}) {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void (async () => {
      const excalidraw = await import('@excalidraw/excalidraw');
      const data = await excalidraw.exportToSvg({
        elements: contents.elements || [],
        files: contents.files || null,
        exportPadding: 16,
        renderEmbeddables: true,
        appState: {
          ...contents.appState,
          exportWithDarkMode: theme.resolvedTheme === 'dark',
        },
      });
      data.classList.add(widthClass || 'w-full');
      data.classList.add('h-auto');
      ref.current?.replaceChildren(data);
    })();
  }, [contents, theme]);

  return <div className="mt-6 flex justify-center" ref={ref}></div>;
}
