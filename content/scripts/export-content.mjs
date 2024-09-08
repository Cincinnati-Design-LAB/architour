#!/usr/env/bin node

/**
 * I wrote this to share an export of the current state of content to send to
 * Christen. It's meant to be a snapshot of the content as it is now, and does
 * not include all fields.
 */

import * as Cloudinary from 'cloudinary';
import glob from 'fast-glob';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const BUILDINGS_DIR = path.join(process.cwd(), 'content/buildings');
const TOURS_DIR = path.join(process.cwd(), 'content/tours');

const TMP_DIR = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

const BUILDINGS_OUTPUT_FILE = path.join(TMP_DIR, 'buildings.csv');
const TOURS_OUTPUT_FILE = path.join(TMP_DIR, 'tours.csv');

const output = {
  buildings: {
    headings: ['title', 'images', 'static_map', 'draft', 'completion_date', 'content'],
    rows: [],
  },
  tours: {
    headings: ['title', 'image', 'description', 'static_map', 'draft', 'buildingCount', 'icon'],
    rows: [],
  },
};

const buildingFilenames = await glob('**/*.md', { cwd: BUILDINGS_DIR });
for (const building of buildingFilenames) {
  const buildingFilePath = path.join(BUILDINGS_DIR, building);
  const rawContent = fs.readFileSync(buildingFilePath, 'utf8');
  const { data, content } = matter(rawContent);

  const images = (data.images || [])
    .map((publicId) => Cloudinary.v2.url(publicId, { secure: true }))
    .join(',');

  const static_map = data.static_map ? Cloudinary.v2.url(data.static_map, { secure: true }) : null;

  const { title, draft, completion_date } = data;

  output.buildings.rows.push(
    [title, images, static_map, draft, completion_date, content].map((field) => {
      return `"${String(field).replace(/"/g, '""')}"`.replace(/\n/g, ' ');
    }),
  );
}

const tourFilenames = await glob('**/*.md', { cwd: TOURS_DIR });
for (const tour of tourFilenames) {
  const tourFilePath = path.join(TOURS_DIR, tour);
  const rawContent = fs.readFileSync(tourFilePath, 'utf8');
  const { data } = matter(rawContent);

  const image = data.image ? Cloudinary.v2.url(data.image, { secure: true }) : null;
  const static_map = data.static_map ? Cloudinary.v2.url(data.static_map, { secure: true }) : null;

  const { title, draft, description, icon } = data;
  const buildingCount = data.building_ids?.length;

  output.tours.rows.push(
    [title, image, description, static_map, draft, buildingCount, icon].map((field) => {
      return `"${String(field).replace(/"/g, '""')}"`.replace(/\n/g, ' ');
    }),
  );
}

const buildingsCsv =
  output.buildings.headings.join(',') +
  '\n' +
  output.buildings.rows.map((row) => row.join(',')).join('\n');
fs.writeFileSync(BUILDINGS_OUTPUT_FILE, buildingsCsv);

const toursCsv =
  output.tours.headings.join(',') + '\n' + output.tours.rows.map((row) => row.join(',')).join('\n');
fs.writeFileSync(TOURS_OUTPUT_FILE, toursCsv);
