import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

/**
 * Object that holds original reference to markdown, with converted HTML string.
 */
export type Markdown = {
  raw: string;
  html: string;
};

/**
 * Converts markdown string to Markdown object with HTML string and originally
 * markdown content.
 *
 * @param input Markdown string
 * @returns Markdown object with original reference and processed HTML string
 */
export async function processMarkdown(input: string): Promise<Markdown> {
  const html = md.render(input || '') || '';
  return { raw: input, html };
}
