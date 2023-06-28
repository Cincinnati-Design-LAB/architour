import type { ObjectModel } from '@stackbit/types'
import { iconNames } from '../utils/icons'

export const SiteHeader: ObjectModel = {
  name: 'SiteHeader',
  type: 'object',
  fields: [
    { name: 'site_link_label', type: 'string', required: true },
    {
      name: 'nav_links',
      type: 'list',
      items: {
        type: 'model',
        models: ['SiteHeaderLink'],
      },
    },
  ],
}

export const SiteHeaderLink: ObjectModel = {
  name: 'SiteHeaderLink',
  type: 'object',
  fields: [
    { name: 'label', type: 'string', required: true },
    { name: 'href', label: 'URL', type: 'string', required: true },
    { name: 'icon', type: 'enum', options: iconNames.concat(), required: true },
    { name: 'is_button', type: 'boolean', required: true, default: false },
  ],
}
