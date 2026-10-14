import '../styles.scss';
import 'katex/dist/katex.min.css';

import Script from 'next/script';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout, Navbar } from 'nextra-theme-docs';

import { IdleChrome } from '../components/idle-chrome';
import { MathTips } from '../components/math-tips';

export const metadata = {
  metadataBase: new URL('https://modernllms.com'),
  title: {
    template: '%s - Modern LLMs',
  },
  description:
    'A 12-chapter, front-to-back-readable guide on how modern LLMs work, for experienced engineers.',
  applicationName: 'Modern LLMs',
  generator: 'Next.js',
  appleWebApp: {
    title: 'Modern LLMs',
  },
  twitter: {
    site: 'https://modernllms.com',
  },
};

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar logo={<span className="font-black">MODERN LLMS</span>} />
  );
  const pageMap = await getPageMap();
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <IdleChrome />
        <MathTips />
        <Layout
          navbar={navbar}
          feedback={{ content: 'Questions? Leave me feedback' }}
          editLink={'Opinions? Suggest an edit'}
          footer={null}
          docsRepositoryBase="https://github.com/tomasreimers/llm-docs/tree/main"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
          nextThemes={{ defaultTheme: 'dark' }}
        >
          {children}
        </Layout>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-8Y0RZG7VCS"
        />
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'G-8Y0RZG7VCS');        
      `,
          }}
        />
      </body>
    </html>
  );
}
