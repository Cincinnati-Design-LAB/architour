import type { PageModel } from '@stackbit/types'

export const Building: PageModel = {
  name: 'Building',
  type: 'page',
  urlPath: '/buildings/{slug}',
  filePath: 'content/buildings/{slug}.md',
  fields: [{ name: 'title', type: 'string', required: true }],
}
