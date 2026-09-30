import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';
import React from 'react';

const config = {
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { normalizePagesResult } = useConfig();
    const title = normalizePagesResult.activePath.at(-1)?.title;
    const frontMatter = normalizePagesResult.activePath.at(-1)?.frontMatter;

    const url =
      'https://frontenddocs.com' +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title || 'Frontend docs'} />
        <title>{title || 'Frontend docs'}</title>
        <meta
          property="og:description"
          content={
            frontMatter?.description ||
            'A ~20-page, front-to-back-readable guide on writing frontend for experienced developers.'
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@tomasreimers" />
        <meta
          property="og:image"
          content={`https://frontenddocs.com/api/og${asPath === '/' ? '/default/' : asPath}image.png`}
        />
      </>
    );
  },
};

export default config;
