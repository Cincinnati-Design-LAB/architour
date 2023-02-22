import { defineNestedType } from 'contentlayer/source-files'

export const Markdown = defineNestedType(() => ({
  name: 'Markdown',
  fields: {
    raw: {
      type: 'string',
      description: 'Raw input',
      required: true,
    },
    html: {
      type: 'string',
      description: 'Processed HTML',
      required: true,
    },
  },
}))
