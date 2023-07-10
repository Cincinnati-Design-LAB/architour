import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

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
  const html = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(input);

  return { raw: input, html: html.toString() };
}
