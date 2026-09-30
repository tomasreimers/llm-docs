'use client';

import { useConfig } from 'nextra-theme-docs';

export function Breadcrumbs() {
  const {
    normalizePagesResult: { activePath },
  } = useConfig();

  const frontMatter = activePath.at(-1)?.frontMatter;

  return (
    <div className="nextra-breadcrumb mt-1.5 flex items-center gap-1 overflow-hidden text-sm text-gray-500 dark:text-gray-400 contrast-more:text-current">
      <span
        className="whitespace-nowrap transition-colors font-medium text-gray-700 contrast-more:font-bold contrast-more:text-current dark:text-gray-100 contrast-more:dark:text-current"
        title={activePath[0].title}
      >
        {activePath[0].title}
      </span>
      <span
        className="whitespace-nowrap font-medium contrast-more:font-bold text-gray-500 dark:text-gray-400 contrast-more:text-gray-800 contrast-more:dark:text-gray-50"
        title={activePath[0].title}
      >
        · {frontMatter?.readingTime} minute read (
        {frontMatter?.wordCount?.toLocaleString() || '?'} words)
      </span>
    </div>
  );
}
