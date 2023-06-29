import { defineDocumentType, defineNestedType } from 'contentlayer/source-files'
import { iconNames } from '../utils/icons'

/* ----- Header ----- */

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

/* ----- Footer ----- */

const SiteFooterLink = defineNestedType(() => ({
  name: 'SiteFooterLink',
  fields: {
    label: { type: 'string', required: true },
    href: { label: 'URL', type: 'string', required: true },
  },
}))

const SiteFooterContact = defineNestedType(() => ({
  name: 'SiteFooterContact',
  fields: {
    label: { type: 'string', required: true },
    name: { type: 'string', required: true },
    email: { type: 'string', required: true },
  },
}))

const SiteFooter = defineNestedType(() => ({
  name: 'SiteFooter',
  fields: {
    address: { type: 'list', required: true, of: { type: 'string' } },
    contact_links: { type: 'list', of: [SiteFooterContact], required: true },
    nav_links: { type: 'list', of: SiteFooterLink, required: true },
  },
}))

/* ----- Config ----- */

export const SiteConfig = defineDocumentType(() => ({
  name: 'SiteConfig',
  filePathPattern: 'data/site.json',
  fields: {
    header: {
      type: 'nested',
      of: SiteHeader,
      required: true,
    },
    footer: {
      type: 'nested',
      of: SiteFooter,
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
