import type { RawBuilding } from '@/content/schema/Building.d'
import { transformBuilding } from '@/content/schema/Building.transformer'
import { BUILDINGS_CACHE_DIR, BUILDINGS_DIR, PRETTIER_CONFIG } from '@/content/utils/constants'
import glob from 'fast-glob'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import prettier from 'prettier'

/* ----- Helpers ----- */

/**
 * Reads and parses a markdown file using Gray Matter.
 *
 * @param filePath Absolute path to a markdown file
 * @returns Parsed content from Gray Matter
 */
async function parseMarkdownFile(filePath: string): Promise<{ [key: string]: any }> {
  const fileContents = await fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  return { ...data, content }
}

/* ----- Building ----- */

/**
 * Reads, transforms, and caches content for every building.
 */
export async function generateBuildingCache() {
  // Create directory for cache files it doesn't exist
  if (!fs.existsSync(BUILDINGS_CACHE_DIR)) fs.mkdirSync(BUILDINGS_CACHE_DIR, { recursive: true })
  // Remove all existing cache files
  glob.sync(path.join(BUILDINGS_CACHE_DIR, '*.json')).map(fs.unlinkSync)
  // Get all building files from source
  const allBuildingFiles = glob.sync(path.join(BUILDINGS_DIR, '**/*.md'))
  // Loop through each building file, transform it, and write it to cache
  for (const sourceFilePath of allBuildingFiles) {
    const rawBuilding = await parseMarkdownFile(sourceFilePath)
    const building = await transformBuilding(rawBuilding as RawBuilding, sourceFilePath)
    const outputFilePath = path.join(BUILDINGS_CACHE_DIR, `${building.slug}.json`)
    const output = prettier.format(JSON.stringify(building), { ...PRETTIER_CONFIG, parser: 'json' })
    fs.writeFileSync(outputFilePath, output)
  }
  // Log output
  console.log(`Generated ${allBuildingFiles.length} buildings`)
}
