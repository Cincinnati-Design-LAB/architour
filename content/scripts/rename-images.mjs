#!/usr/env/bin node

/**
 * This was a one-time script to put images in directories for each building, so
 * that I could manually rename them and clean them up. I suspected there were a
 * lot of duplicates.
 *
 * I didn't end up using this. I moved over to the upload images script, which
 * did this work and added the images to Cloudinary.
 */

import path from 'path';
import fs from 'fs';
import glob from 'fast-glob';
import matter from 'gray-matter';

const BUILDINGS_DIR = path.join(process.cwd(), 'content/buildings');
const IMAGES_DIR = path.join(process.cwd(), 'tmp/image-export');
const NEW_IMAGES_DIR = path.join(process.cwd(), 'tmp/new-images');

const buildingFilenames = await glob('**/*.md', { cwd: BUILDINGS_DIR });

for (const building of buildingFilenames) {
  const buildingFilePath = path.join(BUILDINGS_DIR, building);
  const rawContent = fs.readFileSync(buildingFilePath, 'utf8');
  const { data } = matter(rawContent);
  const slug = building.replace('.md', '');

  if (!data.images || !data.images.length) continue;

  // I have a theory that there are a lot of duplicates, and that they all are
  // listed as the second half of the array.
  const images = data.images.slice(0, data.images.length / 2);

  // Copy images into a directory for the building. This also renames them to
  // use the building name so that they are better named if downloaded by users.
  data.images = images.map((image, index) => {
    const filename = image.replace(/^https:\/\/ucarecdn.com\//, '').replace(/\/$/, '.jpg');
    const existingFilePath = path.join(IMAGES_DIR, filename);
    const newFileDir = path.join(NEW_IMAGES_DIR, slug);
    const newFilePath = path.join(newFileDir, `${slug}-0${index + 1}.jpg`);
    const shortNewFilePath = path.join(slug, path.basename(newFilePath));
    // Make the directory if it doesn't exist
    if (!fs.existsSync(newFileDir)) fs.mkdirSync(newFileDir, { recursive: true });
    // Copy the file
    fs.copyFileSync(existingFilePath, newFilePath);
    console.log(`Copied ${path.basename(existingFilePath)} to ${shortNewFilePath}`);
    return shortNewFilePath;
  });

  // Write the new images to the building's markdown file.
  fs.writeFileSync(buildingFilePath, matter.stringify(rawContent, data));
}
