import type { ObjectModel } from '@stackbit/types';

export const BuildingAttributeSection: ObjectModel = {
  name: 'BuildingAttributeSection',
  type: 'object',
  // TODO: Clean this up. Talk to Simon.
  // `document` is supposed to be available so we can use the helper method.
  // But it's not. So we have to do this.
  preview: ({ documentField }) => {
    if (
      !('fields' in documentField) ||
      !documentField.fields.page_location ||
      !('value' in documentField.fields.page_location)
    ) {
      return { title: 'Building Attribute Section' };
    }
    return {
      title: documentField.fields.page_location.value,
    };
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
      options: ['above_images', 'below_images', 'above_map', 'below_map'],
    },
  ],
};
