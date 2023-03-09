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
      description: 'Cloudinary public ID for the primary tour image',
      required: true,
    },
    time_estimate: {
      type: 'string',
      description: 'Average length of time tour is expected to take',
      required: true,
    },
    icon: {
      type: 'enum',
      description: 'A supported icon name, which appears on the tour card.',
      options: ['arrow-left', 'calendar', 'eye', 'building', 'clock', 'kentucky', 'star', 'waves'],
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
