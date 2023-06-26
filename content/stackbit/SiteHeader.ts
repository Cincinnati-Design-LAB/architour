import type { ObjectModel } from '@stackbit/types'

export const SiteHeader: ObjectModel = {
  name: 'SiteHeader',
  type: 'object',
  fields: [{ name: 'site_link_label', type: 'string', required: true }],
}
