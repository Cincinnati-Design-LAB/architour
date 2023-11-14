import { getThumbnailOptions } from '@/content/utils/thumbnails';
import type { ObjectModel } from '@stackbit/types';

export const BuildingRenovationSection: ObjectModel = {
  name: 'BuildingRenovationSection',
  type: 'object',
  preview: ({ documentField }) => {
    return {
      title: (documentField as any).fields.page_location.value || 'Building Renovation Section',
    };
  },
  fields: [
    {
      name: 'title',
      type: 'string',
      description: 'Heading to be shown above the list of renovations',
      required: true,
    },
    {
      name: 'renovations',
      type: 'list',
      description: 'A list of renovations to be shown in the section.',
      required: true,
      items: { type: 'model', models: ['BuildingRenovation'] },
    },
    {
      name: 'page_location',
      type: 'enum',
      description: 'Where the section should be shown on the detail page.',
      required: true,
      controlType: 'thumbnails',
      options: getThumbnailOptions({
        dirname: 'page-location',
        options: ['above_images', 'below_images', 'above_map', 'below_map'],
      }),
    },
  ],
};
