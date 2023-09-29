import { iconOptions } from '@/content/utils/icons';
import type { PageModel } from '@stackbit/types';

export const Tour: PageModel = {
  name: 'Tour',
  type: 'page',
  urlPath: '/tours/{slug}',
  filePath: 'content/tours/{slug}.md',
  hideContent: true,
  fieldGroups: [
    { name: 'buildings', icon: 'layer-group', label: 'Buildings' },
    { name: 'map', icon: 'globe', label: 'Map' },
    { name: 'settings', icon: 'gear', label: 'Settings' },
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      required: true,
    },
    {
      name: 'image',
      type: 'string',
      description: 'Cloudinary public ID for the primary tour image',
    },
    {
      name: 'time_estimate',
      type: 'string',
      description: 'Average length of time tour is expected to take',
    },
    {
      name: 'icon',
      type: 'enum',
      description: 'Icons appear on the tour card.',
      options: iconOptions,
      controlType: 'thumbnails',
    },
    {
      name: 'description',
      type: 'markdown',
      description: 'A brief description about the tour or what to expect.',
    },
    // --- Group: Buildings --- //
    {
      name: 'buildingIds',
      label: 'Buildings',
      type: 'list',
      items: { type: 'reference', models: ['Building'] },
      group: 'buildings',
    },
    // --- Group: Map --- //
    {
      name: 'static_map',
      type: 'string',
      // TODO: Better description
      //
      // description:
      //   'Cloudinary Public ID for the static map image, processed by a local script, using Mapbox.',
      group: 'map',
    },
    {
      name: 'static_map_cache',
      type: 'string',
      description:
        'A cache key used to know when to update the static map image. Cannot be edited.',
      readOnly: true,
      group: 'map',
    },
    // --- Group: Settings --- //
    {
      name: 'draft',
      type: 'boolean',
      description: `Whether the tour should be shown on the website. It still may not if it doesn't meet minimum requirements.`,
      default: true,
      group: 'settings',
    },
  ],
};
