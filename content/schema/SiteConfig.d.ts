import { IconName } from '@/content/utils/icons';

/* ----- Header ----- */

export type RawHeader = {
  type: 'Header';
  site_link_label: string;
  nav_links: RawHeaderLink[];
};

export interface Header extends Omit<RawHeader, 'type' | 'nav_links'> {
  nav_links: HeaderLink[];
}

export type RawHeaderLink = {
  type: 'HeaderLink';
  label: string;
  href: string;
  is_button: boolean;
};

export interface HeaderLink extends Omit<RawHeaderLink, 'type'> {}

/* ----- Footer ----- */

export type RawFooter = {
  type: 'Footer';
  address: string[];
  contact_links: RawFooterContact[];
  nav_links: RawFooterLink[];
};

export interface Footer extends Omit<RawFooter, 'type' | 'contact_links' | 'nav_links'> {
  contact_links: FooterContact[];
  nav_links: FooterLink[];
}

export type RawFooterContact = {
  type: 'FooterContact';
  label: string;
  name: string;
  email: string;
};

export interface FooterContact extends Omit<RawFooterContact, 'type'> {}

export type RawFooterLink = {
  type: 'FooterLink';
  label: string;
  href: string;
};

export interface FooterLink extends Omit<RawFooterLink, 'type'> {}

/* ----- Buildings Config ----- */

export type RawBuildingsConfig = {
  type: 'BuildingsConfig';
  page_label: string;
  page_icon: IconName;
  page_header_theme: 'primary' | 'secondary';
  nav_label: string;
};

export interface BuildingsConfig extends Omit<RawBuildingsConfig, 'type'> {}

/* ----- Tours Config ----- */

export type RawToursConfig = {
  type: 'ToursConfig';
  page_label: string;
  page_icon: IconName;
  page_header_theme: 'primary' | 'secondary';
  nav_label: string;
};

export interface ToursConfig extends Omit<RawToursConfig, 'type'> {}

/* ----- Site Config ----- */

export type RawSiteConfig = {
  type: 'SiteConfig';
  header: RawHeader;
  footer: RawFooter;
  buildings: RawBuildingsConfig;
  tours: RawToursConfig;
};

export interface SiteConfig {
  /** Content for the site header */
  header: Header;
  /** Content for the site footer */
  footer: Footer;
  /** Configuration for buildings list page */
  buildings: BuildingsConfig;
  /** Configuration for tours list page */
  tours: ToursConfig;
  /** Relative path to the file from the root of the project. */
  stackbit_id: string;
}
