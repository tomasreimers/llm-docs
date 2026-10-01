'use client';

import { useConfig } from 'nextra-theme-docs';

export function Breadcrumbs() {
  const {
    normalizePagesResult: { activePath },
  } = useConfig();

  const frontMatter = activePath.at(-1)?.frontMatter;
  // Sidebar titles look like "Chapter 1: Neural networks"; the kicker only
  // needs the chapter part — the h1 right below carries the name.
  const chapter = (activePath[0]?.title || '').split(':')[0];

  return (
    <div className="mt-1.5 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 contrast-more:text-current">
      <span
        className="inline-block rounded-[3px] px-2 py-0.5 text-[0.7rem] tracking-wider uppercase text-[#3f3a1a] dark:text-[#f5edc0]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--brand), var(--brand-alt))',
        }}
      >
        {chapter}
      </span>
      <span className="whitespace-nowrap">
        {frontMatter?.readingTime} minute read
      </span>
    </div>
  );
}
