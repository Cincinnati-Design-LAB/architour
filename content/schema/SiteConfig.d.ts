/* ----- Header ----- */

import { IconName } from '@/content/utils/icons';

export type RawHeader = {};

export interface Header {}

/* ----- Footer ----- */

export type RawFooter = {};

export interface Footer {}

/* ----- Buildings Config ----- */

export type RawBuildingsConfig = {};

export interface BuildingsConfig {}

/* ----- Tours Config ----- */

export type RawToursConfig = {
  page_label: string;
  page_icon: IconName;
  page_header_theme: 'primary' | 'secondary';
  nav_label: string;
};

export interface ToursConfig extends RawToursConfig {}

/* ----- Site Config ----- */

export type RawSiteConfig = {
  tours: RawToursConfig;
};

export interface SiteConfig {
  /** Configuration for tours list page */
  tours: ToursConfig;
  /** Relative path to the file from the root of the project. */
  stackbit_id: string;
}
