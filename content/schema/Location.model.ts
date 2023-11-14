import type { ObjectModel } from '@stackbit/types';

export const Location: ObjectModel = {
  name: 'Location',
  type: 'object',
  preview: ({ documentField }) => {
    const fields = (documentField as any).fields;
    if (!fields.lat.value || !fields.lng.value) return { title: 'Location' };
    return { title: `${fields.lat.value}, ${fields.lng.value}` };
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
