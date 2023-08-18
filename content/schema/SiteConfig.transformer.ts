import type {
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
  const tours = await transformToursConfig(options.raw.tours);
  const stackbit_id = path.relative(ROOT_DIR, options.absSrcPath);
  return { tours, stackbit_id };
}

/* ----- Header ----- */

/* ----- Footer ----- */

/* ----- Buildings Config ----- */
/* ----- Tours Config ----- */

async function transformToursConfig(raw: RawToursConfig): Promise<ToursConfig> {
  return {
    page_label: raw.page_label,
    page_icon: raw.page_icon,
    page_header_theme: raw.page_header_theme,
    nav_label: raw.nav_label,
  };
}
