import { iconNames } from '@/content/utils/icons';
import { DataModel } from '@stackbit/sdk';
import { ObjectModel } from '@stackbit/types';

/* ----- Header ----- */

// const SiteHeaderLink = defineNestedType(() => ({
//   name: 'SiteHeaderLink',
//   fields: {
//     label: { type: 'string', required: true },
//     href: { label: 'URL', type: 'string', required: true },
//     icon: { type: 'enum', options: iconNames.concat(), required: true },
//     is_button: { type: 'boolean', required: true, default: false },
//   },
// }));

// const SiteHeader = defineNestedType(() => ({
//   name: 'SiteHeader',
//   fields: {
//     site_link_label: { type: 'string', required: true },
//     nav_links: { type: 'list', of: SiteHeaderLink, required: true },
//   },
// }));

/* ----- Footer ----- */

// const SiteFooterLink = defineNestedType(() => ({
//   name: 'SiteFooterLink',
//   fields: {
//     label: { type: 'string', required: true },
//     href: { label: 'URL', type: 'string', required: true },
//   },
// }));

// const SiteFooterContact = defineNestedType(() => ({
//   name: 'SiteFooterContact',
//   fields: {
//     label: { type: 'string', required: true },
//     name: { type: 'string', required: true },
//     email: { type: 'string', required: true },
//   },
// }));

// const SiteFooter = defineNestedType(() => ({
//   name: 'SiteFooter',
//   fields: {
//     address: { type: 'list', required: true, of: { type: 'string' } },
//     contact_links: { type: 'list', of: [SiteFooterContact], required: true },
//     nav_links: { type: 'list', of: SiteFooterLink, required: true },
//   },
// }));

/* ----- Buildings Config ----- */

const BuildingsConfig: ObjectModel = {
  type: 'object',
  name: 'BuildingsConfig',
  fields: [
    { name: 'page_label', type: 'string', required: true },
    { name: 'page_icon', type: 'enum', options: iconNames.concat(), required: true },
    { name: 'page_header_theme', type: 'enum', options: ['primary', 'secondary'], required: true },
    { name: 'nav_label', type: 'string', required: true },
  ],
};

/* ----- Tours Config ----- */

const ToursConfig: ObjectModel = {
  type: 'object',
  name: 'ToursConfig',
  fields: [
    { name: 'page_label', type: 'string', required: true },
    { name: 'page_icon', type: 'enum', options: iconNames.concat(), required: true },
    { name: 'page_header_theme', type: 'enum', options: ['primary', 'secondary'], required: true },
    { name: 'nav_label', type: 'string', required: true },
  ],
};

/* ----- Site Config ----- */

export const SiteConfig: DataModel = {
  type: 'data',
  name: 'SiteConfig',
  filePath: 'data/site.json',
  fields: [
    //   header: {
    //     type: 'nested',
    //     of: SiteHeader,
    //     required: true,
    //   },
    //   footer: {
    //     type: 'nested',
    //     of: SiteFooter,
    //     required: true,
    //   },
    { name: 'buildings', type: 'model', models: ['BuildingsConfig'], required: true },
    { name: 'tours', type: 'model', models: ['ToursConfig'], required: true },
  ],
};
