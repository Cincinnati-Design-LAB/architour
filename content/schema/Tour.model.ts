import { generateStaticMap } from '@/content/actions/generate-static-map';
import { assetSources } from '@/content/utils/asset-sources';
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
      type: 'image',
      source: assetSources.tours.name,
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
      name: 'building_ids',
      label: 'Buildings',
      type: 'list',
      items: { type: 'reference', models: ['Building'] },
      group: 'buildings',
    },
    // --- Group: Map --- //
    {
      name: 'static_map',
      type: 'string',
      description: 'A read-only reference to the generated static map image.',
      group: 'map',
      readOnly: true,
      actions: [
        { name: 'generateStaticMap', label: 'Generate Static Map', run: generateStaticMap },
      ],
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
