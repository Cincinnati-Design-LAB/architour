#!/usr/env/bin node

/**
 * This script reads images for each building, renames them, and stores the new
 * name back to the building file.
 */

import path from 'path'
import fs from 'fs'
import glob from 'fast-glob'
import matter from 'gray-matter'
import { v2 as cloudinary } from 'cloudinary'

const BUILDINGS_DIR = path.join(process.cwd(), 'content/buildings')
const IMAGES_DIR = path.join(process.cwd(), 'tmp/image-export')

// --- Upload Helper ---

async function uploadImage(filePath, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { folder, use_filename: true }, (err, result) => {
      if (err) return reject(err)
      return resolve(result)
    })
  })
}

// --- The Loop ---

const buildingFilenames = await glob('**/*.md', { cwd: BUILDINGS_DIR })

for (const building of buildingFilenames) {
  const rawContent = fs.readFileSync(path.join(BUILDINGS_DIR, building))
  const { data, content } = matter(rawContent)
  const slug = building.replace('.md', '')

  if (!data.images || !data.images.length) continue

  // Rename the images with the building slug
  const newFilenames = data.images.map((image, index) => {
    const filename = image.replace(/^https:\/\/ucarecdn.com\//, '').replace(/\/$/, '.jpg')
    const newFilename = `${slug}-${index}.jpg`
    fs.copyFileSync(path.join(IMAGES_DIR, filename), path.join(IMAGES_DIR, newFilename))
    return newFilename
  })

  // Upload the images to Cloudinary
  let imageData = []
  for (const image of newFilenames) {
    const result = await uploadImage(path.join(IMAGES_DIR, image), `buildings/${slug}`)
    const { public_id, width, height, format } = result
    imageData.push({ public_id, width, height, format })
  }

  // Store the Cloudinary details back to the building file
  const newContent = matter.stringify(content, { ...data, images: imageData })
  fs.writeFileSync(path.join(BUILDINGS_DIR, building), newContent)

  process.exit(1)
}
