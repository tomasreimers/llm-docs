// Chapters 2–12 are written but unreleased: `display: 'hidden'` keeps them
// out of the sidebar (and prev/next pagination) while leaving the pages
// reachable by direct URL. To release a chapter, remove its `display`.
export default {
  index: {
    display: 'hidden',
    theme: {
      navbar: true,
      breadcrumb: false,
    },
  },
  '-- Foundations': {
    type: 'separator',
    title: 'FOUNDATIONS',
  },
  'neural-networks': {
    title: 'Chapter 1: Neural networks',
    theme: { breadcrumb: false },
  },
  'language-modeling': {
    title: 'Chapter 2: Language modeling',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
  transformers: {
    title: 'Chapter 3: The transformer',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
  // Separators don't support `display: 'hidden'` — restore these entries as
  // their sections release.
  // '-- Architecture': { type: 'separator', title: 'MODEL ARCHITECTURE' },
  scaling: {
    title: 'Chapter 4: Scaling',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
  'modern-variants': {
    title: 'Chapter 5: Modern variants',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
  interpretability: {
    title: 'Chapter 6: Interpretability',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
  // '-- Training': { type: 'separator', title: 'TRAINING' },
  'pre-training': {
    title: 'Chapter 7: Pre-training',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
  'post-training': {
    title: 'Chapter 8: Post-training',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
  evaluation: {
    title: 'Chapter 9: Evaluation',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
  // '-- Inference': { type: 'separator', title: 'INFERENCE' },
  hardware: {
    title: 'Chapter 10: Hardware',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
  serving: {
    title: 'Chapter 11: Serving',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
  sampling: {
    title: 'Chapter 12: Sampling & beyond',
    display: 'hidden',
    theme: { breadcrumb: false },
  },
};
