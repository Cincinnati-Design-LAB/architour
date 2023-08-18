import type { RawSiteConfig, SiteConfig } from '@/content/schema/SiteConfig.d';
import { ROOT_DIR } from '@/content/utils/constants';
import path from 'path';

/* ----- Site Config ----- */

type SiteConfigTransformerOptions = {
  raw: RawSiteConfig;
  /** Absolute path to the source file */
  absSrcPath: string;
};

export async function transformSiteConfig(
  options: SiteConfigTransformerOptions,
): Promise<SiteConfig> {
  const stackbit_id = path.relative(ROOT_DIR, options.absSrcPath);
  return { stackbit_id };
}

/* ----- Header ----- */

/* ----- Footer ----- */

/* ----- Buildings Config ----- */
