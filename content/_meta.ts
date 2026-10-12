// All chapters are listed; unreleased ones are grayed out and disabled via
// the "unreleased chapters" rule in styles.scss. To release a chapter,
// remove its path from that CSS list.
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
    theme: { breadcrumb: false },
  },
  transformers: {
    title: 'Chapter 3: The transformer',
    theme: { breadcrumb: false },
  },
  '-- Architecture': {
    type: 'separator',
    title: 'MODEL ARCHITECTURE',
  },
  sampling: {
    title: 'Chapter 4: Sampling',
    theme: { breadcrumb: false },
  },
  scaling: { title: 'Chapter 5: Scaling', theme: { breadcrumb: false } },
  'modern-variants': {
    title: 'Chapter 6: Modern variants',
    theme: { breadcrumb: false },
  },
  interpretability: {
    title: 'Chapter 7: Interpretability',
    theme: { breadcrumb: false },
  },
  '-- Training': {
    type: 'separator',
    title: 'TRAINING',
  },
  'pre-training': {
    title: 'Chapter 8: Pre-training',
    theme: { breadcrumb: false },
  },
  'post-training': {
    title: 'Chapter 9: Post-training',
    theme: { breadcrumb: false },
  },
  evaluation: {
    title: 'Chapter 10: Evaluation',
    theme: { breadcrumb: false },
  },
  '-- Inference': {
    type: 'separator',
    title: 'INFERENCE',
  },
  hardware: { title: 'Chapter 11: Hardware', theme: { breadcrumb: false } },
  serving: { title: 'Chapter 12: Serving', theme: { breadcrumb: false } },
  '-- Applications': {
    type: 'separator',
    title: 'APPLICATIONS',
  },
  harness: {
    title: 'Chapter 13: The harness',
    theme: { breadcrumb: false },
  },
  '-- Epilogue': {
    type: 'separator',
    title: 'EPILOGUE',
  },
  epilogue: {
    title: 'Epilogue: Where this leaves you',
    theme: { breadcrumb: false },
  },
};
