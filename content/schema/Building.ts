import { defineDocumentType, defineNestedType, FieldDef } from 'contentlayer/source-files'

const BuildingLocation = defineNestedType(() => ({
  name: 'BuildingLocation',
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

const BuildingAttribute = defineNestedType(() => ({
  name: 'BuildingAttribute',
  fields: {
    label: {
      type: 'string',
      description: 'Label above the attribute value',
      required: true,
    },
    value: {
      type: 'string',
      description: 'Attribute value',
      required: true,
    },
    layout: {
      type: 'enum',
      description: 'Layout options for the attribute',
      options: ['half_width', 'full_width'],
    },
  },
}))

const BuildingRenovation = defineNestedType(() => ({
  name: 'BuildingRenovation',
  fields: {
    title: {
      type: 'string',
      description: 'Heading to be shown above the list of renovations',
      required: true,
    },
    date: {
      type: 'string',
      description: 'Year (or date) to display',
      required: true,
    },
    description: {
      type: 'string',
      description: 'Description of the renovation',
    },
    architect: {
      type: 'string',
      description: 'Name of the architect to display, if known',
    },
    contractor: {
      type: 'string',
      description: 'Name of the contractor to display, if known',
    },
  },
}))

const SHARED_FIELDS: { [key: string]: FieldDef } = {
  page_location: {
    type: 'enum',
    description: 'Where the section should be shown on the detail page.',
    required: true,
    options: ['above_images', 'below_images', 'above_map', 'below_map'],
  },
}

const BuildingRenovationSection = defineNestedType(() => ({
  name: 'BuildingRenovationSection',
  fields: {
    title: {
      type: 'string',
      description: 'Heading to be shown above the list of renovations',
      required: true,
    },
    renovations: {
      type: 'list',
      description: 'A list of renovations to be shown in the section.',
      required: true,
      of: BuildingRenovation,
    },
    page_location: SHARED_FIELDS.page_location,
  },
}))

const BuildingAttributeSection = defineNestedType(() => ({
  name: 'BuildingAttributeSection',
  fields: {
    attributes: {
      type: 'list',
      description: 'A list of attributes to be shown in the section.',
      of: BuildingAttribute,
      required: true,
    },
    page_location: SHARED_FIELDS.page_location,
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
      of: BuildingLocation,
    },
    address: {
      type: 'string',
      description: 'Full address for the building.',
    },
    sections: {
      type: 'list',
      description: 'A list of attributes to be shown on the detail page. Each ',
      of: [BuildingAttributeSection, BuildingRenovationSection],
    },
    completion_date: {
      type: 'string',
      description: 'Loose date field (as a string) for when the building was completed.',
    },
    draft: {
      type: 'boolean',
      description: `Whether the building should be shown on the website. It still may not if it doesn't meet minimum requirements.`,
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
        'Used to determine when to reprocess the static map image. This caches current location, which is what affects the map image.',
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
  },
}))
