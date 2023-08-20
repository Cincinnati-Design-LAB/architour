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
 * Sort, filter, and paginate a list of buildings, and return all pages for that
 * collection.
 */
export async function getAllBuildingsPages(
  options: BuildingCollectionOptions,
): Promise<BuildingCollection[]> {
  const buildings = await getBuildings();
  const buildingsPerPage = 12;
  const totalPages = Math.ceil(buildings.length / buildingsPerPage);
  const buildingPages = Array.from({ length: totalPages }).map((_, i) => ({
    buildings: buildings.slice(i * buildingsPerPage, (i + 1) * buildingsPerPage),
    totalPages,
    page: i + 1,
  }));

  return buildingPages;
}

/**
 * Locate and return a specific buildings page.
 */
export async function getBuildingsPage(
  options: BuildingCollectionOptions & { page: number },
): Promise<BuildingCollection> {
  const buildingsPages = await getAllBuildingsPages(options);

  if (options.page > buildingsPages.length) {
    throw new Error(`Page ${options.page} does not exist.`);
  }

  return buildingsPages[options.page - 1];
}
