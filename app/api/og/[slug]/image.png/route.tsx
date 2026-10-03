import { ImageResponse } from '@vercel/og';
import fs from 'fs';
import path from 'path';

import meta from '../../../../../content/_meta';

const serif = fs.readFileSync(
  path.join(process.cwd(), './assets/fonts/SourceSerif/SourceSerif4-Regular.otf')
);
const serifSemibold = fs.readFileSync(
  path.join(process.cwd(), './assets/fonts/SourceSerif/SourceSerif4-Semibold.otf')
);
const serifItalic = fs.readFileSync(
  path.join(process.cwd(), './assets/fonts/SourceSerif/SourceSerif4-It.otf')
);

const INK = '#1c1c22';
const PAPER = '#fcfbf7';
const HIGHLIGHT = '#fff7b1';

export async function generateStaticParams() {
  return [
    ...Object.entries(meta)
      .filter(
        ([_key, value]) =>
          typeof value !== 'object' ||
          !('type' in value) ||
          value.type !== 'separator'
      )
      .map(([key, _value]) => {
        return {
          slug: key,
        };
      }),
    { slug: 'default' },
  ];
}

export async function GET(
  _: Request,
  { params: { slug } }: { params: { slug: string } }
) {
  const details = slug === 'default' ? 'Modern LLMs' : meta[slug];
  const fullTitle =
    (typeof details === 'string' ? details : details?.title) ?? 'Modern LLMs';
  let [chapter, title]: [string | undefined, string] = fullTitle.split(': ');

  if (typeof title === 'undefined') {
    title = chapter as string;
    chapter = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: PAPER,
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 64px',
          boxSizing: 'border-box',
          fontFamily: '"SourceSerif"',
        }}
      >
        {/* wordmark (skip on the default card, where it would duplicate the title) */}
        <div
          style={{
            display: 'flex',
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: 5,
            color: INK,
            opacity: slug === 'default' ? 0 : 0.85,
          }}
        >
          MODERN LLMS
        </div>

        {/* title block, vertically centered in remaining space */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {chapter && (
            <div
              style={{
                display: 'flex',
                backgroundColor: HIGHLIGHT,
                color: INK,
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: 4,
                padding: '7px 16px',
                marginBottom: 26,
              }}
            >
              {chapter.toUpperCase()}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 15 ? 56 : 72,
              fontWeight: 600,
              color: INK,
              lineHeight: 1.12,
              maxWidth: '640px',
            }}
          >
            {title}
          </div>
        </div>

        {/* footer: hairline + url */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: 19,
            color: INK,
            opacity: 0.55,
            fontStyle: 'italic',
          }}
        >
          <div style={{ display: 'flex' }}>
            How modern large language models work
          </div>
          <div style={{ display: 'flex' }}>modernllms.com</div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 418,
      fonts: [
        { name: 'SourceSerif', data: serif, style: 'normal', weight: 400 },
        { name: 'SourceSerif', data: serifSemibold, style: 'normal', weight: 600 },
        { name: 'SourceSerif', data: serifItalic, style: 'italic', weight: 400 },
      ],
    }
  );
}
