#!/usr/env/bin node

/**
 * This script reads images for each building, renames them, and stores the new
 * name back to the building file.
 */

import { v2 as cloudinary } from 'cloudinary';
import glob from 'fast-glob';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const BUILDINGS_DIR = path.join(process.cwd(), 'content/buildings');
const IMAGES_DIR = path.join(process.cwd(), 'tmp/image-export');

// --- Upload Helper ---

async function uploadImage(filePath, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { folder, use_filename: true }, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

// --- The Loop ---

const buildingFilenames = await glob('**/*.md', { cwd: BUILDINGS_DIR });

for (const building of buildingFilenames) {
  const rawContent = fs.readFileSync(path.join(BUILDINGS_DIR, building));
  const { data, content } = matter(rawContent);
  const slug = building.replace('.md', '');

  if (!data.images || !data.images.length) continue;

  // Rename the images with the building slug. I had a theory that there are a
  // lot of duplicates, and that they all are listed as the second half of the
  // array. It turned out to be true, which is why we're only using half the
  // images.
  const newFilePaths = data.images.slice(0, data.images.length / 2).map((image, index) => {
    const filename = image.replace(/^https:\/\/ucarecdn.com\//, '').replace(/\/$/, '.jpg');
    const newFilename = `${slug}-${index}.jpg`;
    const existingFilePath = path.join(IMAGES_DIR, filename);
    const newFileDir = path.join(IMAGES_DIR, slug);
    const newFilePath = path.join(newFileDir, newFilename);
    if (!fs.existsSync(newFileDir)) fs.mkdirSync(newFileDir, { recursive: true });
    fs.copyFileSync(existingFilePath, newFilePath);
    return newFilePath;
  });

  // Upload the images to Cloudinary
  let imageData = [];
  for (const image of newFilePaths) {
    const result = await uploadImage(image, `buildings/${slug}`);
    imageData.push(result.public_id);
  }

  // Store the Cloudinary details back to the building file
  const newContent = matter.stringify(content, { ...data, images: imageData });
  fs.writeFileSync(path.join(BUILDINGS_DIR, building), newContent);
  console.log(`[Upload Complete] ${data.title} (${slug})`);
}
