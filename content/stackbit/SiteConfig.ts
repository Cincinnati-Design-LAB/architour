import type { DataModel } from '@stackbit/types';

export const SiteConfig: DataModel = {
  name: 'SiteConfig',
  type: 'data',
  filePath: 'content/data/site.json',
  fields: [
    {
      name: 'header',
      type: 'model',
      models: ['SiteHeader'],
      required: true,
    },
    {
      name: 'footer',
      type: 'model',
      models: ['SiteFooter'],
      required: true,
    },
    {
      name: 'buildings',
      label: 'Buildings Config',
      type: 'model',
      models: ['BuildingsConfig'],
      required: true,
    },
    {
      name: 'tours',
      label: 'Tours Config',
      type: 'model',
      models: ['ToursConfig'],
      required: true,
    },
  ],
};
