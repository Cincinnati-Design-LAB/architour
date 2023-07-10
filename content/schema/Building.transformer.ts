import type { Building, RawBuilding } from '@/content/schema/Building.d'
import { ROOT_DIR } from '@/content/utils/constants'
import path from 'path'

export async function transformBuilding(raw: RawBuilding, filePath: string): Promise<Building> {
  const slug = path.basename(filePath, path.extname(filePath))

  const building: Building = {
    name: raw.title,
    slug,
    stackbitId: path.relative(ROOT_DIR, filePath),
    urlPath: `/buildings/${slug}`,

    // TODO
    tourCount: 0,

    // stackbitId: raw.stackbitId,
    // urlPath: raw.urlPath,
    // slug: raw.slug,
    // completion_date: raw.completion_date,
    // address: raw.address,
    // draft: raw.draft,
    // name: raw.title,
    // tourCount: 0,
    // excerpt: "",
  }

  return building
}
