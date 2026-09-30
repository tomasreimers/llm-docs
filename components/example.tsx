'use client';

import { Sandpack } from '@codesandbox/sandpack-react';
import { useTheme } from 'nextra-theme-docs';

export function Example({
  files,
  template,
  console,
  visibleFiles,
  dependencies,
}: {
  template: 'static' | 'react';
  files: Record<string, string>;
  console?: boolean;
  visibleFiles?: string[];
  dependencies?: Record<string, string>;
}) {
  const theme = useTheme();

  return (
    <Sandpack
      options={{
        classes: {
          'sp-layout': 'mt-6',
        },
        showConsole: console,
        visibleFiles,
      }}
      customSetup={{
        dependencies,
      }}
      files={files}
      template={template}
      theme={theme.resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  );
}
