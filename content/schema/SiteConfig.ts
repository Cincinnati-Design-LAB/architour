import { defineDocumentType, defineNestedType } from 'contentlayer/source-files'
import { iconNames } from '../utils/icons'

const SiteHeaderLink = defineNestedType(() => ({
  name: 'SiteHeaderLink',
  fields: {
    label: { type: 'string', required: true },
    href: { label: 'URL', type: 'string', required: true },
    icon: { type: 'enum', options: iconNames.concat(), required: true },
    is_button: { type: 'boolean', required: true, default: false },
  },
}))

const SiteHeader = defineNestedType(() => ({
  name: 'SiteHeader',
  fields: {
    site_link_label: { type: 'string', required: true },
    nav_links: { type: 'list', of: SiteHeaderLink, required: true },
  },
}))

export const SiteConfig = defineDocumentType(() => ({
  name: 'SiteConfig',
  filePathPattern: 'data/site.json',
  fields: {
    header: {
      type: 'nested',
      of: SiteHeader,
      required: true,
    },
  },
  computedFields: {
    stackbitId: {
      type: 'string',
      description: 'Unique ID for Stackbit editor',
      resolve: (siteConfig) => ['content', siteConfig._id].join('/'),
    },
  },
}))
