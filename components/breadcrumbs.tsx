'use client';

import { useConfig } from 'nextra-theme-docs';

export function Breadcrumbs({ readingTime }: { readingTime?: number }) {
  const {
    normalizePagesResult: { activePath },
  } = useConfig();

  // Sidebar titles look like "Chapter 1: Neural networks"; the kicker only
  // needs the chapter part — the h1 right below carries the name.
  const chapter = (activePath[0]?.title || '').split(':')[0];

  return (
    <div className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 contrast-more:text-current">
      {chapter}
      {readingTime ? ` · ${readingTime} minute read` : ''}
    </div>
  );
}
