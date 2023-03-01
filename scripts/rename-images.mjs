#!/usr/env/bin node

/**
 * This was a one-time script to put images in directories for each building, so
 * that I could manually rename them and clean them up. I suspected there were a
 * lot of duplicates.
 */

import path from 'path'
import fs from 'fs'
import glob from 'fast-glob'
import matter from 'gray-matter'

const BUILDINGS_DIR = path.join(process.cwd(), 'content/buildings')
const IMAGES_DIR = path.join(process.cwd(), 'tmp/image-export')
const NEW_IMAGES_DIR = path.join(process.cwd(), 'tmp/new-images')

const buildingFilenames = await glob('**/*.md', { cwd: BUILDINGS_DIR })

for (const building of buildingFilenames) {
  const rawContent = fs.readFileSync(path.join(BUILDINGS_DIR, building))
  const { data } = matter(rawContent)
  const slug = building.replace('.md', '')

  if (!data.images || !data.images.length) continue

  // Copy images into a directory for the building
  for (const image of data.images) {
    const filename = image.replace(/^https:\/\/ucarecdn.com\//, '').replace(/\/$/, '.jpg')
    const existingFilePath = path.join(IMAGES_DIR, filename)
    const newFileDir = path.join(NEW_IMAGES_DIR, slug)
    const newFilePath = path.join(newFileDir, filename)
    // Make the directory if it doesn't exist
    if (!fs.existsSync(newFileDir)) fs.mkdirSync(newFileDir, { recursive: true })
    // Copy the file
    fs.copyFileSync(existingFilePath, newFilePath)
  }
}
