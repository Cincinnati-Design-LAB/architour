import { getThumbnailOptions } from '@/content/utils/thumbnails';
import type { ObjectModel } from '@stackbit/types';

export const BuildingAttributeSection: ObjectModel = {
  name: 'BuildingAttributeSection',
  type: 'object',
  preview: ({ documentField }) => {
    const title = (documentField as any).fields.page_location.value || 'Building Attribute Section';
    return { title };
  },
  fields: [
    {
      name: 'attributes',
      type: 'list',
      description: 'A list of attributes to be shown in the section.',
      required: true,
      items: { type: 'model', models: ['BuildingAttribute'] },
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
