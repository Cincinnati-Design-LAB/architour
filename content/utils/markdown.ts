import fs from 'fs';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

/* ----- Markdown Converter ----- */

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

/* ----- File Parser ----- */

/**
 * Reads and parses a markdown file using Gray Matter.
 *
 * @param filePath Absolute path to a markdown file
 * @returns Parsed content from Gray Matter
 */
export async function parseMarkdownFile<T>(filePath: string): Promise<T> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  const fileContents = await fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return { ...data, content } as T;
}
