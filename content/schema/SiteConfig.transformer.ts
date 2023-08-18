import type {
  BuildingsConfig,
  Footer,
  FooterContact,
  FooterLink,
  Header,
  HeaderLink,
  RawBuildingsConfig,
  RawFooter,
  RawFooterContact,
  RawFooterLink,
  RawHeader,
  RawHeaderLink,
  RawSiteConfig,
  RawToursConfig,
  SiteConfig,
  ToursConfig,
} from '@/content/schema/SiteConfig.d';
import { ROOT_DIR } from '@/content/utils/constants';
import path from 'path';

/* ----- Site Config ----- */

type SiteConfigTransformerOptions = {
  /** Raw parsed content from the source file */
  raw: RawSiteConfig;
  /** Absolute path to the source file */
  absSrcPath: string;
};

export async function transformSiteConfig(
  options: SiteConfigTransformerOptions,
): Promise<SiteConfig> {
  const header = await transformHeader(options.raw.header);
  const footer = await transformFooter(options.raw.footer);
  const buildings = await transformBuildingsConfig(options.raw.buildings);
  const tours = await transformToursConfig(options.raw.tours);
  const stackbit_id = path.relative(ROOT_DIR, options.absSrcPath);
  return { header, footer, buildings, tours, stackbit_id };
}

/* ----- Header ----- */

async function transformHeader(raw: RawHeader): Promise<Header> {
  const site_link_label = raw.site_link_label;
  const nav_links = await Promise.all(raw.nav_links.map(transformHeaderLink));
  return { site_link_label, nav_links };
}

async function transformHeaderLink(raw: RawHeaderLink): Promise<HeaderLink> {
  return {
    label: raw.label,
    href: raw.href,
    icon: raw.icon,
    is_button: raw.is_button,
  };
}

/* ----- Footer ----- */

async function transformFooter(raw: RawFooter): Promise<Footer> {
  const address = raw.address;
  const contact_links = await Promise.all(raw.contact_links.map(transformFooterContact));
  const nav_links = await Promise.all(raw.nav_links.map(transformFooterLink));
  return { address, contact_links, nav_links };
}

async function transformFooterLink(raw: RawFooterLink): Promise<FooterLink> {
  return {
    label: raw.label,
    href: raw.href,
  };
}

async function transformFooterContact(raw: RawFooterContact): Promise<FooterContact> {
  return {
    label: raw.label,
    name: raw.name,
    email: raw.email,
  };
}

/* ----- Buildings Config ----- */

async function transformBuildingsConfig(raw: RawBuildingsConfig): Promise<BuildingsConfig> {
  return {
    page_label: raw.page_label,
    page_icon: raw.page_icon,
    page_header_theme: raw.page_header_theme,
    nav_label: raw.nav_label,
  };
}
/* ----- Tours Config ----- */

async function transformToursConfig(raw: RawToursConfig): Promise<ToursConfig> {
  return {
    page_label: raw.page_label,
    page_icon: raw.page_icon,
    page_header_theme: raw.page_header_theme,
    nav_label: raw.nav_label,
  };
}
