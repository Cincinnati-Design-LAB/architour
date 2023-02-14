#!/usr/env/bin node

import axios from 'axios'
import client from 'https'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import glob from 'fast-glob'

const BASE_URL = 'https://ucarecdn.com/'
const OUTPUT_DIR = path.join(process.cwd(), 'tmp/image-export')
const BUILDINGS_DIR = path.join(process.cwd(), 'src/content/buildings/')

async function getImageIds() {
  const files = await glob('**/*.md', { cwd: BUILDINGS_DIR })
  let imageIds = []

  for (const file of files) {
    const { data } = matter(fs.readFileSync(path.join(BUILDINGS_DIR, file)))
    imageIds.push(
      data.images.map((image) => image.replace('https://ucarecdn.com/', '').replace(/\/$/, '')),
    )
  }

  return imageIds.flat()
}

async function getImageMetadata(id) {
  const response = await axios.get(`${BASE_URL}${id}/-/json/`)
  return response.data
}

async function downloadImage(id) {
  const metadata = await getImageMetadata(id)

  const url = `https://ucarecdn.com/${id}/`
  let format = metadata.format.toLowerCase()
  if (format === 'jpeg') format = 'jpg'
  const filepath = path.join(OUTPUT_DIR, `${id}.${format}`)

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  })
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve(filepath))
  })
}

const imageIds = await getImageIds()
for (const id of imageIds) await downloadImage(id)
