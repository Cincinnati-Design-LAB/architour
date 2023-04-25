import type { PageModel } from '@stackbit/types'

export const Tour: PageModel = {
  name: 'Tour',
  type: 'page',
  urlPath: '/tours/{slug}',
  filePath: 'content/tours/{slug}.md',
  fields: [{ name: 'title', type: 'string', required: true }],
}
