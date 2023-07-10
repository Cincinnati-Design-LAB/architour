import type { ObjectModel } from '@stackbit/types';

export const SiteFooter: ObjectModel = {
  name: 'SiteFooter',
  type: 'object',
  fields: [
    {
      name: 'address',
      type: 'list',
      required: true,
      items: { type: 'string' },
      description: 'Each item in the list represents a line on the site.',
    },
    {
      name: 'contact_links',
      type: 'list',
      items: {
        type: 'model',
        models: ['SiteFooterContact'],
      },
    },
    {
      name: 'nav_links',
      type: 'list',
      items: {
        type: 'model',
        models: ['SiteFooterLink'],
      },
    },
  ],
};

export const SiteFooterLink: ObjectModel = {
  name: 'SiteFooterLink',
  type: 'object',
  fields: [
    { name: 'label', type: 'string', required: true },
    { name: 'href', label: 'URL', type: 'string', required: true },
  ],
};

export const SiteFooterContact: ObjectModel = {
  name: 'SiteFooterContact',
  type: 'object',
  fields: [
    { name: 'label', type: 'string', required: true },
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string', required: true },
  ],
};
