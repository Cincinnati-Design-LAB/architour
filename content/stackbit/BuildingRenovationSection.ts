import type { ObjectModel } from '@stackbit/types'

export const BuildingRenovationSection: ObjectModel = {
  name: 'BuildingRenovationSection',
  type: 'object',
  // TODO: Clean this up. Talk to Simon.
  // `document` is supposed to be available so we can use the helper method.
  // But it's not. So we have to do this.
  preview: ({ documentField }) => {
    if (
      !('fields' in documentField) ||
      !documentField.fields.page_location ||
      !documentField.fields.title ||
      !('value' in documentField.fields.page_location) ||
      !('value' in documentField.fields.title)
    ) {
      return { title: 'Building Renovation Section' }
    }
    return {
      title: `${documentField.fields.title.value} [${documentField.fields.page_location.value}]`,
    }
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
      options: ['above_images', 'below_images', 'above_map', 'below_map'],
    },
  ],
}
