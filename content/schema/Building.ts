import { defineDocumentType, defineNestedType } from 'contentlayer/source-files'

const Location = defineNestedType(() => ({
  name: 'Location',
  fields: {
    lat: {
      type: 'number',
      description: 'Latitude for the location',
      required: true,
    },
    lng: {
      type: 'number',
      description: 'Longitude for the location',
      required: true,
    },
  },
}))

export const Building = defineDocumentType(() => ({
  name: 'Building',
  filePathPattern: 'buildings/*.md',
  fields: {
    title: {
      type: 'string',
      description: 'Name of the building',
      required: true,
    },
    images: {
      type: 'list',
      description: 'A list of Cloudinary public IDs for building images',
      of: { type: 'string' },
    },
    location: {
      type: 'nested',
      of: Location,
    },
    address: {
      type: 'string',
      description: 'Full address for the building.',
    },
    original_owner: {
      type: 'string',
      description: 'Name of the original owner, when the building was constructed.',
    },
    current_owner: {
      type: 'string',
      description: 'Name of the current owner of the property.',
    },
    date_of_completion: {
      type: 'string',
      description: 'Loose date field (as a string) for when the building was completed.',
    },
    style: {
      type: 'string',
      description:
        'Brief statement about the architectural style. (Include more details in the body.)',
    },
    architect: {
      type: 'string',
      description: 'Name of the original architect.',
    },
    associate_architect: {
      type: 'string',
      description: 'Additional architect(s) on the original design.',
    },
    contractor: {
      type: 'string',
      description: 'Name of the original contractor.',
    },
    original_function: {
      type: 'string',
      description: 'How the build was first used.',
    },
    significance: {
      type: 'string',
      description: 'What makes the building significant?',
    },
    historic_status: {
      type: 'string',
      description: 'If it is a registered historic building, note here.',
    },
    unique_features: {
      type: 'string',
      description: 'Additional interesting features not captured in other fields.',
    },
    renovations: {
      type: 'string',
      description: 'Brief descriptions of renovation(s) done to the property.',
    },
    renovation_date: {
      type: 'string',
      description: 'When the renovation(s) were completed.',
    },
    renovation_architect: {
      type: 'string',
      description: 'Architect name for the renovation(s).',
    },
    renovation_style: {
      type: 'string',
      description: 'Explanation of the style of renovation(s).',
    },
    renovation_changes: {
      type: 'string',
      description: 'What changed in the renovation(s)?',
    },
    public_access: {
      type: 'string',
      description: 'How and which parts of the building can be accessed by the public.',
    },
    resources: {
      type: 'string',
      description: 'URL(s) to additional resources for the building.',
    },
    green_building_features: {
      type: 'string',
      description: 'Note LEED status, and other sustainability significance.',
    },
    quotes: {
      type: 'string',
      description: 'Quotes about the building.',
    },
    photo_credit: {
      type: 'string',
      description: 'If the images used for the building required attribution, add that here.',
    },
    static_map_url: {
      type: 'string',
      description:
        'Cloudinary Public ID for the static map image, processed by a local script, using Mapbox.',
    },
  },
  computedFields: {
    urlPath: {
      type: 'string',
      description: 'Consistent URL path to the detail page on the website',
      resolve: (building) => `/${building._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      description: 'URL segment used to build dynamic paths in Astro template.',
      resolve: (building) => building._raw.sourceFileName.replace(/\.md$/, ''),
    },
    hasPrimaryAttributes: {
      type: 'boolean',
      description:
        'Whether the building contains any of the primary attributes to be shown on the detail page.',
      resolve: (building) =>
        building.historic_status || building.current_owner || building.unique_features
          ? true
          : false,
    },
    hasSecondaryAttributes: {
      type: 'boolean',
      description:
        'Whether the building contains any of the secondary attributes to be shown on the detail page.',
      resolve: (building) =>
        building.date_of_completion ||
        building.original_owner ||
        building.architect ||
        building.style
          ? true
          : false,
    },
  },
}))
