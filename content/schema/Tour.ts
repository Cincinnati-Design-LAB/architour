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
    },
    time_estimate: {
      type: 'string',
      description: 'Average length of time tour is expected to take',
    },
    icon: {
      type: 'enum',
      description: 'A supported icon name, which appears on the tour card.',
      options: ['arrow-left', 'calendar', 'eye', 'building', 'clock'],
    },
    description: {
      type: 'markdown',
      description: 'A brief description about the tour or what to expect.',
    },
    buildings: {
      type: 'list',
      of: Building,
    },
    draft: {
      type: 'boolean',
      description: `Whether the tour should be shown on the website. It still may not if it doesn't meet minimum requirements.`,
      default: true,
    },
    static_map: {
      type: 'string',
      description:
        'Cloudinary Public ID for the static map image, processed by a local script, using Mapbox.',
    },
    static_map_cache: {
      type: 'string',
      description:
        'Used to determine when to reprocess the static map image. This caches building locations, which is what affects the map image.',
    },
  },
  computedFields: {
    stackbitId: {
      type: 'string',
      description: 'Unique ID for Stackbit editor',
      resolve: (tour) => ['content', tour._id].join('/'),
    },
    urlPath: {
      type: 'string',
      description: 'Consistent URL path to the detail page on the website',
      resolve: (tour) => `/${tour._raw.flattenedPath}`,
    },
    mapUrlPath: {
      type: 'string',
      description: 'URL path to the map view of the tour',
      resolve: (tour) => `/${tour._raw.flattenedPath}/map`,
    },
    slug: {
      type: 'string',
      description: 'URL segment used to build dynamic paths in Astro template.',
      resolve: (tour) => tour._raw.sourceFileName.replace(/\.md$/, ''),
    },
  },
}))
