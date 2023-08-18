import { Building } from '@/content/schema/Building';
import glob from 'fast-glob';
import path from 'path';
import { BUILDINGS_CACHE_DIR } from './constants';

/**
 * Retrieves processed buildings from the cache.
 */
export async function getBuildings(): Promise<Building[]> {
  const allBuildingFiles = glob.sync(path.join(BUILDINGS_CACHE_DIR, '*.json'));
  const buildings = await Promise.all(
    allBuildingFiles.map(async (filePath) => await import(/* @vite-ignore */ filePath)),
  );
  return buildings;
}

/* ----- Pagination ----- */

type BuildingCollectionOptions = {};

type BuildingCollection = {
  buildings: Building[];
  totalPages: number;
  page: number;
};

/**
 * Sort, filter, and paginate a list of buildings.
 *
 * @param options Sorting and filtering options
 * @returns A list of filtered and sorted buildings
 */
export async function getBuildingPages(
  options: BuildingCollectionOptions,
): Promise<BuildingCollection[]> {
  const buildings = await getBuildings();
  const buildingsPerPage = 12;
  const totalPages = Math.ceil(buildings.length / buildingsPerPage);
  return Array.from({ length: totalPages }).map((_, i) => ({
    buildings: buildings.slice(i * buildingsPerPage, (i + 1) * buildingsPerPage),
    totalPages,
    page: i + 1,
  }));
}

/**
 * Gets all building collections and then returns buildings for a specific page.
 *
 * @param options Sorting and filtering options
 * @returns A list of buildings for a particular page
 */
export async function getBuildingsOnPage(
  options: BuildingCollectionOptions & { page: number },
): Promise<Building[]> {
  const buildingPages = await getBuildingPages(options);
  if (options.page > buildingPages.length) {
    throw new Error(`Page ${options.page} does not exist.`);
  }
  return buildingPages[options.page - 1].buildings;
}
