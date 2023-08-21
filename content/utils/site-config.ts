import { SiteConfig } from '@/content/schema/SiteConfig';
import { DATA_CACHE_DIR } from '@/content/utils/constants';
import path from 'path';

/**
 * Retrieves site config from content cache.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  const siteConfigPath = path.join(DATA_CACHE_DIR, 'site.json');
  const siteConfig = (await import(/* @vite-ignore */ siteConfigPath, {
    assert: { type: 'json' },
  })) as SiteConfig;
  return siteConfig;
}
