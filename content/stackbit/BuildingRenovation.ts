import type { ObjectModel } from '@stackbit/types';

export const BuildingRenovation: ObjectModel = {
  name: 'BuildingRenovation',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      description: 'Heading to be shown above the list of renovations',
      required: true,
    },
    {
      name: 'date',
      type: 'string',
      description: 'Year (or date) to display',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description of the renovation',
    },
    {
      name: 'architect',
      type: 'string',
      description: 'Name of the architect to display, if known',
    },
    {
      name: 'contractor',
      type: 'string',
      description: 'Name of the contractor to display, if known',
    },
  ],
};
