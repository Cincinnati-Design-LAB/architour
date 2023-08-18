import { DataModel } from '@stackbit/sdk';

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

// const BuildingsConfig = defineNestedType(() => ({
//   name: 'BuildingsConfig',
//   fields: {
//     page_label: { type: 'string', required: true },
//     page_icon: { type: 'enum', options: iconNames.concat(), required: true },
//     page_header_theme: { type: 'enum', options: ['primary', 'secondary'], required: true },
//     nav_label: { type: 'string', required: true },
//   },
// }));

/* ----- Tours Config ----- */

// const ToursConfig = defineNestedType(() => ({
//   name: 'ToursConfig',
//   fields: {
//     page_label: { type: 'string', required: true },
//     page_icon: { type: 'enum', options: iconNames.concat(), required: true },
//     page_header_theme: { type: 'enum', options: ['primary', 'secondary'], required: true },
//     nav_label: { type: 'string', required: true },
//   },
// }));

/* ----- Site Config ----- */

export const SiteConfig: DataModel = {
  type: 'data',
  name: 'SiteConfig',
  filePath: 'data/site.json',
  fields: []
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
  //   buildings: {
  //     type: 'nested',
  //     of: BuildingsConfig,
  //     required: true,
  //   },
  //   tours: {
  //     type: 'nested',
  //     of: ToursConfig,
  //     required: true,
  //   },
  // },
  // computedFields: {
  //   stackbit_id: {
  //     type: 'string',
  //     description: 'Unique ID for Stackbit editor',
  //     resolve: (siteConfig) => ['content', siteConfig._id].join('/'),
  //   },
  // },
}
