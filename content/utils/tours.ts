import { Tour } from '@/content/schema/Tour';
import glob from 'fast-glob';
import path from 'path';
import { TOURS_CACHE_DIR } from './constants';

/**
 * Retrieves processed tours from the cache.
 */
export async function getTours(): Promise<Tour[]> {
  const allTourFiles = glob.sync(path.join(TOURS_CACHE_DIR, '*.json'));
  const tours = await Promise.all(
    allTourFiles.map(
      async (filePath) =>
        (await import(/* @vite-ignore */ filePath, { assert: { type: 'json' } })) as Tour,
    ),
  );
  return tours;
}
