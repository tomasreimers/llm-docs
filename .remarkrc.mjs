// Used by eslint-mdx so that ESLint can parse the $...$ / $$...$$ math
// syntax used in chapters (rendered by nextra's `latex: true` at build time).
import remarkMath from 'remark-math';

export default {
  plugins: [remarkMath],
};
