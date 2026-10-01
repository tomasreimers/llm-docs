import nextra from 'nextra'
import path from "path";
import process from "process";

import { wordCountPlugin } from './plugins/word_count.mjs'

const __dirname = import.meta.dirname || "";

const withNextra = nextra({
  search: {
    codeblocks: false
  },
  latex: {
    renderer: 'katex',
    options: {
      strict: false,
      trust: (context) => context.command === '\\htmlData',
      macros: {
        // \tip{explanation}{term} — hoverable annotation on a math term.
        // The explanation must avoid commas and equals signs (KaTeX parses
        // htmlData attributes as comma-separated key=value pairs).
        '\\tip': '\\htmlData{tip=#1}{#2}',
      },
    },
  },
  mdxOptions: {
    remarkPlugins: [wordCountPlugin]
  }
})

export default withNextra({
  output: "export",
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
})
