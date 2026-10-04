export function Byline({ readingTime }: { readingTime?: number }) {
  return (
    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 contrast-more:text-current">
      <a
        href="https://twitter.com/tomasreimers"
        target="_blank"
        rel="noreferrer"
        className="font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-100 dark:hover:text-white contrast-more:font-bold contrast-more:text-current"
      >
        Tomas Reimers
      </a>
      {readingTime ? (
        <>
          {' '}
          <span aria-hidden="true">·</span> {readingTime} minute read
        </>
      ) : null}
    </div>
  );
}
