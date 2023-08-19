import { iconNames } from '@/content/utils/icons';
import { DataModel } from '@stackbit/sdk';
import { ObjectModel } from '@stackbit/types';

/* ----- Header ----- */

const HeaderLink: ObjectModel = {
  type: 'object',
  name: 'HeaderLink',
  fields: [
    { name: 'label', type: 'string', required: true },
    { name: 'href', label: 'URL', type: 'string', required: true },
    { name: 'icon', type: 'enum', options: iconNames.concat(), required: true },
    { name: 'is_button', type: 'boolean', required: true, default: false },
  ],
};

const Header: ObjectModel = {
  type: 'object',
  name: 'Header',
  fields: [
    { name: 'site_link_label', type: 'string', required: true },
    {
      name: 'nav_links',
      type: 'list',
      items: { type: 'model', models: ['HeaderLink'] },
      required: true,
    },
  ],
};

/* ----- Footer ----- */

const FooterLink: ObjectModel = {
  type: 'object',
  name: 'FooterLink',
  fields: [
    { name: 'label', type: 'string', required: true },
    { name: 'href', label: 'URL', type: 'string', required: true },
  ],
};

const FooterContact: ObjectModel = {
  type: 'object',
  name: 'FooterContact',
  fields: [
    { name: 'label', type: 'string', required: true },
    { name: 'name', type: 'string', required: true },
    { name: 'email', type: 'string', required: true },
  ],
};

const Footer: ObjectModel = {
  type: 'object',
  name: 'Footer',
  fields: [
    { name: 'address', type: 'list', required: true, items: { type: 'string' } },
    {
      name: 'contact_links',
      type: 'list',
      items: { type: 'model', models: ['FooterContact'] },
      required: true,
    },
    {
      name: 'nav_links',
      type: 'list',
      items: { type: 'model', models: ['FooterLink'] },
      required: true,
    },
  ],
};

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

const SiteConfig: DataModel = {
  type: 'data',
  name: 'SiteConfig',
  filePath: 'data/site.json',
  fields: [
    { name: 'header', type: 'model', models: ['Header'], required: true },
    { name: 'footer', type: 'model', models: ['Footer'], required: true },
    { name: 'buildings', type: 'model', models: ['BuildingsConfig'], required: true },
    { name: 'tours', type: 'model', models: ['ToursConfig'], required: true },
  ],
};

export const models = [
  HeaderLink,
  Header,
  FooterLink,
  FooterContact,
  Footer,
  BuildingsConfig,
  ToursConfig,
  SiteConfig,
];
