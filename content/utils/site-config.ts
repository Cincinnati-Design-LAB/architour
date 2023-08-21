import { SiteConfig } from '@/content/schema/SiteConfig';
import { DATA_CACHE_DIR } from '@/content/utils/constants';
import fs from 'fs';
import path from 'path';

/**
 * Retrieves site config from content cache.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  const siteConfigPath = path.join(DATA_CACHE_DIR, 'site.json');
  const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf-8')) as SiteConfig;
  return siteConfig;
}
