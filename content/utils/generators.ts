import type { Building, RawBuilding } from '@/content/schema/Building.d';
import {
  attachBuildingRefs,
  transformBuilding,
  validateBuilding,
} from '@/content/schema/Building.transformer';
import { transformSiteConfig } from '@/content/schema/SiteConfig.transformer';
import { RawTour, Tour } from '@/content/schema/Tour';
import { attachTourRefs, transformTour, validateTour } from '@/content/schema/Tour.transformer';
import {
  BUILDINGS_CACHE_DIR,
  BUILDINGS_DIR,
  DATA_CACHE_DIR,
  DATA_DIR,
  EDITOR_MODE,
  PRETTIER_CONFIG,
  TOURS_CACHE_DIR,
  TOURS_DIR,
  UPDATE_CONTROL_PATH,
} from '@/content/utils/constants';
import glob from 'fast-glob';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import prettier from 'prettier';

/* ----- Main Controller ----- */

/**
 * Controller that orchestrates reading raw content from the source, then
 * transforming it in the proper order.
 */
export async function generateContentCache() {
  await initCacheDirs();
  // Read raw content from the source directory and remove any drafts if we're
  // not in editor mode.
  const rawBuildings = (await getRawBuildings()).filter(filterCollection);
  const rawTours = (await getRawTours()).filter(filterCollection);
  // Transform tours and buildings without attaching references to each other.
  const buildingsWithoutRefs = await Promise.all(
    rawBuildings.map(async (raw) => await transformBuilding({ raw, filePath: raw.file_path })),
  );
  const toursWithoutRefs = await Promise.all(
    rawTours.map(async (raw) => await transformTour({ raw, filePath: raw.file_path })),
  );
  // Collect all content before adding references and running validators.
  const contentWithoutRefs = { buildings: buildingsWithoutRefs, tours: toursWithoutRefs };
  // Attach references to each other and run validators.
  const buildings = await Promise.all(
    buildingsWithoutRefs.map(async (b) => {
      const building = await attachBuildingRefs({ building: b, ...contentWithoutRefs });
      await validateBuilding({ building });
      return building;
    }),
  );
  const tours = await Promise.all(
    toursWithoutRefs.map(async (t) => {
      const tour = await attachTourRefs({ tour: t, ...contentWithoutRefs });
      await validateTour({ tour });
      return tour;
    }),
  );
  // Write the transformed content to file.
  await cacheBuildings(buildings);
  console.log(`Generated ${buildings.length} buildings`);
  await cacheTours(tours);
  console.log(`Generated ${tours.length} tours`);
  await cacheSiteConfig();
  console.log(`Generated site config`);
  await touchUpdateControl();
}

/* ----- Building ----- */

/**
 * Identifies and reads all building files from the source directory.
 */
async function getRawBuildings(): Promise<RawBuilding[]> {
  return await Promise.all(
    glob
      .sync(path.join(BUILDINGS_DIR, '**/*.md'))
      .map(async (sourceFilePath) => await parseMarkdownFile<RawBuilding>(sourceFilePath)),
  );
}

/**
 * Handles writing transformed content to the cache directory.
 */
async function cacheBuildings(buildings: Building[]) {
  await Promise.all(
    buildings.map(
      async (building) =>
        await writeContentToCache({
          cacheDir: BUILDINGS_CACHE_DIR,
          content: building,
          filename: `${building.slug}.json`,
        }),
    ),
  );
}

/* ----- Tour ----- */

/**
 * Identifies and reads all tour files from the source directory.
 */
async function getRawTours(): Promise<RawTour[]> {
  return await Promise.all(
    glob
      .sync(path.join(TOURS_DIR, '**/*.md'))
      .map(async (sourceFilePath) => await parseMarkdownFile<RawTour>(sourceFilePath)),
  );
}

/**
 * Handles writing transformed content to the cache directory.
 */
async function cacheTours(tours: Tour[]) {
  await Promise.all(
    tours.map(
      async (tour) =>
        await writeContentToCache({
          cacheDir: TOURS_CACHE_DIR,
          content: tour,
          filename: `${tour.slug}.json`,
        }),
    ),
  );
}

/* ----- Site Config ----- */

/**
 * Handles writing transformed content to the cache directory.
 */
async function cacheSiteConfig() {
  const rawSiteConfigPath = path.join(DATA_DIR, 'site.json');
  const rawSiteConfig = JSON.parse(fs.readFileSync(rawSiteConfigPath, 'utf8'));
  const content = await transformSiteConfig({ raw: rawSiteConfig, absSrcPath: rawSiteConfigPath });
  await writeContentToCache({ cacheDir: DATA_CACHE_DIR, content, filename: `site.json` });
}

/* ----- Helpers ----- */

/**
 * Cleans and preps cache directories.
 */
async function initCacheDirs() {
  [BUILDINGS_CACHE_DIR, TOURS_CACHE_DIR, DATA_CACHE_DIR].forEach((dir) => {
    // Create directory for cache files it doesn't exist
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    //
    // TODO: This is commented out because deleting files causes a temporary
    // 404. Need to be smarter about handling removing deleted files.
    //
    // glob.sync(path.join(dir, '*.json')).map(fs.unlinkSync);
  });
}

/**
 * Reads and parses a markdown file using Gray Matter.
 *
 * @param filePath Absolute path to a markdown file
 * @returns Parsed content from Gray Matter
 */
async function parseMarkdownFile<T>(filePath: string): Promise<T> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  const fileContents = await fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return { ...data, content, file_path: filePath } as T;
}

/**
 * Remove draft content when not in editor mode.
 */
function filterCollection<T extends { draft?: boolean }>(rawItem: T): T {
  if (EDITOR_MODE) return rawItem;
  if (!rawItem.draft) return rawItem;
  return;
}

/**
 * Writes transformed content to disk cache.
 */
async function writeContentToCache(options: {
  cacheDir: string;
  filename: string;
  content: Record<string, any>;
}) {
  const outputFilePath = path.join(options.cacheDir, options.filename);
  const output = await prettier.format(JSON.stringify(options.content), {
    ...PRETTIER_CONFIG,
    parser: 'json',
  });
  fs.writeFileSync(outputFilePath, output);
}

/**
 * Touch the update control file to trigger a rebuild.
 */
async function touchUpdateControl() {
  const updateControl = { lastUpdated: new Date().toISOString() };
  fs.writeFileSync(UPDATE_CONTROL_PATH, JSON.stringify(updateControl));
}
