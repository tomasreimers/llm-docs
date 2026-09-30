import { visit } from 'unist-util-visit';

export function wordCountPlugin() {
  return (tree) => {
    let wordCount = 0;
    let readingTime = 0;

    // Visit all text nodes in the MDX
    visit(tree, 'text', (node) => {
      const words = node.value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      wordCount += words.length;
    });

    // Calculate reading time (200 words per minute)
    readingTime = Math.ceil(wordCount / 200);

    const yaml = "wordCount: " + wordCount + "\nreadingTime: " + readingTime;

    // Add to file data so it's accessible in page props
    if (tree.children[0].type === 'yaml') {
      tree.children[0] = { ...tree.children[0], value: tree.children[0].value + "\n" + yaml };
    } else {
      tree.children.unshift({
        type: 'yaml',
        value: yaml,
      });
    }
  };
}
