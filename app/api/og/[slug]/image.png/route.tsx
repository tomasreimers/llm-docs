import { ImageResponse } from '@vercel/og';
import fs from 'fs';
import path from 'path';

import meta from '../../../../../content/_meta';

const fontData = fs.readFileSync(
  path.join(process.cwd(), './assets/fonts/Inter/Inter-Black.ttf')
);

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
  const details = slug === 'default' ? 'Frontend' : meta[slug];
  const fullTitle = typeof details === 'string' ? details : details.title;
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
          background: 'black',
          display: 'flex',
        }}
      >
        {[2, 8, 32, 128].map((blur) => {
          return (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                fontSize: 96,
                color: 'white',
                width: '100%',
                height: '100%',
                padding: '40px',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 900,
                fontFamily: '"Inter"',
                textShadow: `white 0 0 ${blur}px`,
                mixBlendMode: 'hard-light',
                boxSizing: 'border-box',
              }}
            >
              {title.toLowerCase()}
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            fontSize: 96,
            color: 'black',
            width: '100%',
            height: '100%',
            padding: '40px',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 900,
            fontFamily: '"Inter"',
            boxSizing: 'border-box',
          }}
        >
          {title.toLowerCase()}
        </div>
        {chapter && (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '-50px',
              color: '#1E3A8A',
              fontSize: 24,
              fontWeight: 900,
              fontFamily: '"Inter"',
              width: '240px',
              transform: 'rotate(45deg)',
              padding: '8px',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box',
              backgroundColor: '#1E3A8A33',
              border: '1px solid #FFFFFF0F',
              // boxShadow: "0px -64px 64px 0px #FFFFFF08 inset, 0px -16px 16px 0px #FFFFFF08 inset, 0px -4px 4px 0px #FFFFFF08 inset, 0px 1px 0px 0px #FFFFFF0F inset, 0px -1px 0px 0px #FFFFFF0F inset",
            }}
          >
            {chapter.toUpperCase()}
          </div>
        )}
      </div>
    ),
    {
      width: 800,
      height: 418,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 900,
        },
      ],
    }
  );
}
