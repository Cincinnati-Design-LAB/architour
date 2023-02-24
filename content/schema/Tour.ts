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
    image: {
      type: 'string',
      description: 'URL of the image to show on the card on detail page header',
      required: true,
    },
    time_estimate: {
      type: 'string',
      description: 'Average length of time tour is expected to take',
      required: true,
    },
    description: {
      type: 'markdown',
      description: 'A brief description about the tour or what to expect.',
    },
    buildings: {
      type: 'list',
      of: Building,
    },
  },
  computedFields: {
    urlPath: {
      type: 'string',
      description: 'Consistent URL path to the detail page on the website',
      resolve: (post) => `/${post._raw.flattenedPath}`,
    },
    mapUrlPath: {
      type: 'string',
      description: 'URL path to the map view of the tour',
      resolve: (post) => `/${post._raw.flattenedPath}/map`,
    },
    slug: {
      type: 'string',
      description: 'URL segment used to build dynamic paths in Astro template.',
      resolve: (tour) => tour._raw.sourceFileName.replace(/\.md$/, ''),
    },
  },
}))
