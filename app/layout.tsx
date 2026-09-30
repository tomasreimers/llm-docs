import '../styles.scss';
import 'katex/dist/katex.min.css';

import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout, Navbar } from 'nextra-theme-docs';

import { IdleChrome } from '../components/idle-chrome';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  // TODO: replace llmdocs.com with the real domain once chosen
  metadataBase: new URL('https://llmdocs.com'),
  title: {
    template: '%s - LLM Docs',
  },
  description:
    'A ~12-chapter, front-to-back-readable guide on how modern LLMs work, for experienced engineers.',
  applicationName: 'LLM Docs',
  generator: 'Next.js',
  appleWebApp: {
    title: 'LLM Docs',
  },
  twitter: {
    site: 'https://llmdocs.com',
  },
};

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar logo={<span className="font-black">LLM DOCS</span>} />
  );
  const pageMap = await getPageMap();
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="📚">
        {/* The default Nextra 4 favicon does not work with Chrome (it uses .svg in the embedded css rather than .text) */}
        <link
          rel="icon"
          href={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>📚</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`}
        />
      </Head>
      <body className={inter.className}>
        <IdleChrome />
        <Layout
          navbar={navbar}
          feedback={{ content: 'Questions? Leave me feedback' }}
          editLink={'Opinions? Suggest an edit'}
          footer={null}
          docsRepositoryBase="https://github.com/tomasreimers/ai-docs/tree/main"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
          nextThemes={{ defaultTheme: 'dark' }}
          toc={{
            extraContent: (
              <div className="my-4 text-xs text-gray-500 dark:text-gray-400 contrast-more:text-gray-800 contrast-more:dark:text-gray-50">
                <p>
                  This site is a ~12-chapter, front-to-back-readable guide on
                  how modern large language models work, for experienced
                  engineers.
                </p>
              </div>
            ),
          }}
        >
          {children}
        </Layout>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-LJBHQ5RS43"
        />
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'G-LJBHQ5RS43');        
      `,
          }}
        />
      </body>
    </html>
  );
}
