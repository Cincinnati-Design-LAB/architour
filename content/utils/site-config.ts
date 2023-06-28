import * as Contentlayer from '@/.contentlayer/generated'
import { SiteConfig } from '@/.contentlayer/generated'

/**
 * Retrieves site config object processed by Contentlayer and runs it through a
 * transformer.
 *
 * @returns Transformed site config
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  return await transformSiteConfig(Contentlayer.allSiteConfigs[0])
}

/**
 * Transforms site config
 *
 * @param siteConfig Contentlayer SiteConfig object
 * @returns Transformed building object
 */
export async function transformSiteConfig(
  siteConfig: Contentlayer.SiteConfig,
): Promise<SiteConfig> {
  return siteConfig
}
