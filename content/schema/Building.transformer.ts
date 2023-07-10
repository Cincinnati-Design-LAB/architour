import type { Building, RawBuilding } from '@/content/schema/Building.d';
import { ROOT_DIR } from '@/content/utils/constants';
import path from 'path';

export async function transformBuilding(raw: RawBuilding, filePath: string): Promise<Building> {
  // Name is the title in the source file
  const name = raw.title;
  // Create slug using the filename
  const slug = path.basename(filePath, path.extname(filePath));
  // Stackbit ID is the relative path to the file from the root of the project
  const stackbitId = path.relative(ROOT_DIR, filePath);
  // URL path is the slug prefixed with `/buildings/`
  const urlPath = `/buildings/${slug}`;
  // Draft is true unless explicitly set to false in the source file
  const draft = raw.draft === false ? false : true;

  const building: Building = {
    draft,
    name,
    slug,
    stackbitId,
    // TODO
    tourCount: 0,
    urlPath,

    // stackbitId: raw.stackbitId,
    // urlPath: raw.urlPath,
    // slug: raw.slug,
    // completion_date: raw.completion_date,
    // address: raw.address,
    // draft: raw.draft,
    // name: raw.title,
    // tourCount: 0,
    // excerpt: "",
  };

  return building;
}
