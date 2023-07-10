import type { ObjectModel } from '@stackbit/types';
import { iconNames } from '../utils/icons';

export const ToursConfig: ObjectModel = {
  name: 'ToursConfig',
  type: 'object',
  fields: [
    { name: 'page_label', type: 'string', required: true },
    { name: 'page_icon', type: 'enum', options: iconNames.concat(), required: true },
    { name: 'nav_label', type: 'string', required: true },
    {
      name: 'page_header_theme',
      type: 'enum',
      controlType: 'palette',
      options: [
        {
          label: 'Primary',
          value: 'primary',
          backgroundColor: '#799A05',
          borderColor: '#799A05',
          textColor: '#799A05',
        },
        {
          label: 'Secondary',
          value: 'secondary',
          backgroundColor: '#3D3935',
          borderColor: '#3D3935',
          textColor: '#3D3935',
        },
      ],
      required: true,
    },
  ],
};
