import type { Building, RawBuilding } from '@/content/schema/Building.d';
import { transformBuilding } from '@/content/schema/Building.transformer';
import { RawTour, Tour } from '@/content/schema/Tour';
import { transformTour } from '@/content/schema/Tour.transformer';
import {
  BUILDINGS_CACHE_DIR,
  BUILDINGS_DIR,
  EDITOR_MODE,
  PRETTIER_CONFIG,
  TOURS_CACHE_DIR,
  TOURS_DIR,
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
  const rawBuildings = (await getRawBuildings()).filter(filterCollection);
  const rawTours = (await getRawTours()).filter(filterCollection);
  // Buildings just need the tour count, but the tours needed to be filtered so
  // that we're not counting tours that are drafts in production.
  const buildings = await Promise.all(
    rawBuildings.map(
      async (raw) =>
        await transformBuilding({ raw, filePath: raw.file_path, allRawTours: rawTours }),
    ),
  );
  // Tours require the buildings to be transformed first so that the rich object
  // can be embedded. This object will also include the tour count because it
  // has already been transformed.
  const tours = await Promise.all(
    rawTours.map(
      async (raw) => await transformTour({ raw, filePath: raw.file_path, allBuildings: buildings }),
    ),
  );
  // Write the transformed content to file.
  await cacheBuildings(buildings);
  console.log(`Generated ${buildings.length} buildings`);
  await cacheTours(tours);
  console.log(`Generated ${tours.length} tours`);
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

/* ----- Helper ----- */

/**
 * Cleans and preps cache directories.
 */
async function initCacheDirs() {
  // Create directory for cache files it doesn't exist
  if (!fs.existsSync(BUILDINGS_CACHE_DIR)) fs.mkdirSync(BUILDINGS_CACHE_DIR, { recursive: true });
  // Remove all existing cache files
  glob.sync(path.join(BUILDINGS_CACHE_DIR, '*.json')).map(fs.unlinkSync);
  // Create directory for cache files it doesn't exist
  if (!fs.existsSync(TOURS_CACHE_DIR)) fs.mkdirSync(TOURS_CACHE_DIR, { recursive: true });
  // Remove all existing cache files
  glob.sync(path.join(TOURS_CACHE_DIR, '*.json')).map(fs.unlinkSync);
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
  const output = prettier.format(JSON.stringify(options.content), {
    ...PRETTIER_CONFIG,
    parser: 'json',
  });
  fs.writeFileSync(outputFilePath, output);
}
