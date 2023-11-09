import { generateStaticMap } from '@/content/actions/generate-static-map';
import type { PageModel } from '@stackbit/types';
import { assetSources } from '../utils/asset-sources';

export const Building: PageModel = {
  name: 'Building',
  type: 'page',
  urlPath: '/buildings/{slug}',
  filePath: 'content/buildings/{slug}.md',
  fieldGroups: [
    { name: 'location', icon: 'globe', label: 'Location' },
    { name: 'settings', icon: 'gear', label: 'Settings' },
  ],
  fields: [
    // Group: Content
    {
      name: 'title',
      type: 'string',
      required: true,
    },
    {
      name: 'images',
      type: 'list',
      description: 'A list of Cloudinary public IDs for building images',
      items: { type: 'image', source: assetSources.buildings.name },
    },
    {
      name: 'completion_date',
      type: 'string',
      description: 'Loose date field (as a string) for when the building was completed.',
    },
    {
      name: 'sections',
      type: 'list',
      description: 'A list of attributes to be shown on the detail page. Each ',
      items: {
        type: 'model',
        models: ['BuildingAttributeSection', 'BuildingRenovationSection'],
      },
    },
    // Group: Location
    {
      name: 'address',
      type: 'string',
      description: 'Full address for the building.',
      group: 'location',
    },
    {
      name: 'location',
      type: 'model',
      label: 'Map Coordinates',
      description: 'Geographic coordinates that inform where to put the map marker.',
      models: ['Location'],
      group: 'location',
    },
    {
      name: 'location_test',
      type: 'list',
      items: { type: 'string' },
      controlType: 'custom-modal-html',
      controlFilePath: './content/controls/location-control.html',
      label: 'Map Pin',
      description: 'Interactive field for placing the map marker.',

      group: 'location',
    },
    {
      name: 'static_map',
      type: 'string',
      readOnly: true,
      group: 'location',
      description: 'The static map image can be generated from the context menu on this field.',
      actions: [
        { name: 'generateStaticMap', label: 'Generate Static Map', run: generateStaticMap },
      ],
    },
    // Group: Settings
    {
      name: 'draft',
      type: 'boolean',
      description: `Whether the building should be shown on the website. It still may not if it doesn't meet minimum requirements.`,
      default: true,
      group: 'settings',
    },
  ],
};
