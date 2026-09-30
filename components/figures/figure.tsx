import { type ReactNode } from 'react';

export const ACCENT = {
  blue: '#3b82f6',
  orange: '#f97316',
  green: '#10b981',
  red: '#ef4444',
  purple: '#8b5cf6',
};

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
