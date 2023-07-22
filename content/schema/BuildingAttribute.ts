import type { ObjectModel } from '@stackbit/types';

export const BuildingAttribute: ObjectModel = {
  name: 'BuildingAttribute',
  type: 'object',
  labelField: 'label',
  fields: [
    {
      name: 'label',
      type: 'string',
      description: 'Label above the attribute value',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'Attribute value',
      required: true,
    },
    {
      name: 'layout',
      type: 'enum',
      description: 'Layout options for the attribute',
      options: ['half_width', 'full_width'],
    },
  ],
};
