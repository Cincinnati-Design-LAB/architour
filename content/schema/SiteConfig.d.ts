import { IconName } from '@/content/utils/icons';

/* ----- Helpers ----- */

type Transformed<T, OmittedFields = null> = OmittedFields extends null
  ? Omit<T, 'type'>
  : Omit<T, 'type' | OmittedFields>;

/* ----- Header ----- */

export type RawHeader = {
  type: 'Header';
  site_link_label: string;
  nav_links: RawHeaderLink[];
};

export interface Header extends Transformed<RawHeader, 'nav_links'> {
  nav_links: HeaderLink[];
}

export type RawHeaderLink = {
  type: 'HeaderLink';
  label: string;
  href: string;
  icon: IconName;
  is_button: boolean;
};

export interface HeaderLink extends Transformed<RawHeaderLink> {}

/* ----- Footer ----- */

export type RawFooter = {
  type: 'Footer';
  address: string[];
  contact_links: RawFooterContact[];
  nav_links: RawFooterLink[];
};

export interface Footer extends Transformed<RawFooter, 'contact_links' | 'nav_links'> {
  contact_links: FooterContact[];
  nav_links: FooterLink[];
}

export type RawFooterContact = {
  type: 'FooterContact';
  label: string;
  name: string;
  email: string;
};

export interface FooterContact extends Transformed<RawFooterContact> {}

export type RawFooterLink = {
  type: 'FooterLink';
  label: string;
  href: string;
};

export interface FooterLink extends Transformed<RawFooterLink> {}

/* ----- Buildings Config ----- */

export type RawBuildingsConfig = {
  type: 'BuildingsConfig';
  page_label: string;
  page_icon: IconName;
  page_header_theme: 'primary' | 'secondary';
  nav_label: string;
};

export interface BuildingsConfig extends Transformed<RawBuildingsConfig> {}

/* ----- Tours Config ----- */

export type RawToursConfig = {
  type: 'ToursConfig';
  page_label: string;
  page_icon: IconName;
  page_header_theme: 'primary' | 'secondary';
  nav_label: string;
};

export interface ToursConfig extends Transformed<RawToursConfig> {}

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
