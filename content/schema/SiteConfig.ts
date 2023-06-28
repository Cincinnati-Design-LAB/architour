import { defineDocumentType, defineNestedType } from 'contentlayer/source-files'

const SiteHeader = defineNestedType(() => ({
  name: 'SiteHeader',
  fields: {
    site_link_label: { type: 'string', required: true },
  },
}))

export const SiteConfig = defineDocumentType(() => ({
  name: 'SiteConfig',
  isSingleton: true,
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
