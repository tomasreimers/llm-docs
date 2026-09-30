import { generateStaticParamsFor, importPage } from 'nextra/pages';

import { useMDXComponents as getMDXComponents } from '../../mdx-components';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata(props) {
  const params = await props.params;
  const data = await importPage(params.mdxPath);

  const { metadata: frontMatter } = data;
  const title = frontMatter?.title;
  const url = 'https://frontenddocs.com/' + (params.mdxPath || '');

  return {
    title: title,
    openGraph: {
      url,
      title: title || 'Frontend docs',
      description:
        frontMatter?.description ||
        'A ~20-page, front-to-back-readable guide on writing frontend for experienced developers.',
      images: [
        {
          url: `https://frontenddocs.com/api/og/${!params.mdxPath ? 'default' : params.mdxPath}/image.png`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@tomasreimers',
    },
  };
}

const Wrapper = getMDXComponents([]).wrapper;

export default async function Page(props) {
  const params = await props.params;
  const result = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata } = result;
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
