import { Tour } from '@/content/schema/Tour';
import glob from 'fast-glob';
import fs from 'fs';
import path from 'path';
import { TOURS_CACHE_DIR } from './constants';

/**
 * Retrieves processed tours from the cache.
 */
export async function getTours(): Promise<Tour[]> {
  const allTourFiles = glob.sync(path.join(TOURS_CACHE_DIR, '*.json'));
  const parseFile = (filePath: string): Tour => JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return allTourFiles.map(parseFile);
}
