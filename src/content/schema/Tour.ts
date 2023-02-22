import { defineDocumentType } from 'contentlayer/source-files'
import { Building } from './Building'

export const Tour = defineDocumentType(() => ({
  name: 'Tour',
  filePathPattern: 'tours/*.md',
  fields: {
    title: {
      type: 'string',
      description: 'Name of the tour',
      required: true,
    },
    description: {
      type: 'string',
      description: 'A brief description about the tour or what to expect.',
    },
    buildings: {
      type: 'list',
      of: Building,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      description: 'Consistent URL path to the detail page on the website',
      resolve: (post) => `/${post._raw.flattenedPath}`,
    },
  },
}))
