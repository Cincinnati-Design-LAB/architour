import type { DataModel, PageModel } from '@stackbit/types'

export const SiteConfig: DataModel = {
  name: 'SiteConfig',
  type: 'data',
  filePath: 'content/data/site.json',
  // fieldGroups: [
  //   { name: 'location', icon: 'globe', label: 'Location' },
  //   { name: 'settings', icon: 'gear', label: 'Settings' },
  // ],
  fields: [{ name: 'header', type: 'model', models: ['SiteHeader'], required: true }],
}
