import type { ObjectModel } from '@stackbit/types';

export const Location: ObjectModel = {
  name: 'Location',
  type: 'object',
  // TODO: Clean this up. Talk to Simon.
  // `document` is supposed to be available so we can use the helper method.
  // But it's not. So we have to do this.
  preview: ({ documentField }) => {
    if (
      !('fields' in documentField) ||
      !documentField.fields.lat ||
      !documentField.fields.lng ||
      !('value' in documentField.fields.lat) ||
      !('value' in documentField.fields.lng)
    ) {
      return { title: 'Location' };
    }
    return {
      title: `${documentField.fields.lat.value}, ${documentField.fields.lng.value}`,
    };
  },
  fields: [
    {
      name: 'lat',
      type: 'number',
      subtype: 'float',
      description: 'Latitude for the location',
      required: true,
    },
    {
      name: 'lng',
      type: 'number',
      subtype: 'float',
      description: 'Longitude for the location',
      required: true,
    },
  ],
};
