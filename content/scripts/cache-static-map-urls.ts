import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import https from 'https'
import prettier from 'prettier'
import matter from 'gray-matter'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const TMP_DIR = path.join(process.cwd(), 'tmp')

/* --- Setup --- */

if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR)

/* --- Helpers --- */

/**
 * Downloads an image to `TMP_DIR` from a public URL
 *
 * @param url Public URL to image
 * @param filename Name of file to save to disk
 * @returns Absolute path to file on disk
 */
async function downloadImage(url: string, filename: string): Promise<string> {
  const filepath = path.join(TMP_DIR, filename)
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath))
      } else {
        // Consume response data to free up memory
        res.resume()
        reject(new Error(`Could not download image: ${res.statusCode}`))
      }
    })
  })
}

/**
 * Upload local file to Cloudinary
 *
 * @param filePath Absolute path to file cached on disk
 * @param folder Name of folder in Cloudinary to add file
 * @returns Result from Cloudinary upload
 */
async function uploadImage(filePath: string, folder: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { folder, use_filename: true }, (err, result) => {
      if (err) return reject(err)
      return resolve(result)
    })
  })
}

/**
 * Generate a random string
 * @returns Random string
 */
function randomString(): string {
  return Math.random().toString(36).substring(2, 15)
}

/* --- Buildings --- */

for (const filePath of glob.sync(path.join(CONTENT_DIR, 'buildings/**/*.md'))) {
  const { data, content } = matter.read(filePath)
  if (!data.location) continue

  // Create static map URL
  const smUrl = {
    lat: data.location.lat,
    lng: data.location.lng,
    style: process.env.PUBLIC_MAPBOX_STYLE,
    token: process.env.STATIC_MAPBOX_TOKEN,
    markerUrl: encodeURIComponent('https://architour.netlify.app/MapMarker.png'),
  }
  const newStaticMapUrl = `https://api.mapbox.com/styles/v1/${smUrl.style}/static/url-${smUrl.markerUrl}(${data.location.lng},${data.location.lat})/${data.location.lng},${data.location.lat},15,0/800x450@2x?access_token=${smUrl.token}`

  // Skip if staticMapUrl already exists and matches (if location didn't change)
  if (newStaticMapUrl === data.static_map_url) continue

  // Download static map image
  const filename = `static-map-${randomString()}.png`
  const cachedImage = await downloadImage(newStaticMapUrl, filename)

  // Upload to Cloudinary
  const slug = path.basename(filePath, '.md')
  const cloudinaryResult = await uploadImage(cachedImage, `buildings/${slug}`)

  // Store reference to Cloudinary URL in data
  data.static_map_url = cloudinaryResult.public_id

  // Write new content to file
  const formatted = prettier.format(matter.stringify(content, data), { parser: 'markdown' })
  fs.writeFileSync(filePath, formatted)

  process.exit(0)
}

/* --- Tours --- */

for (const filePath of glob.sync(path.join(CONTENT_DIR, 'tours/**/*.md'))) {
  const { data, content } = matter.read(filePath)
  if (!data.buildings || data.buildings.length === 0) continue

  const markerCoords = data.buildings
    .map((relFilePath) => {
      const { data, content } = matter.read(path.join(CONTENT_DIR, relFilePath))
      return data.location
    })
    .filter(Boolean)

  console.log(data.title, '->', markerCoords)

  // data.static_map_url = `https://api.mapbox.com/styles/v1/${process.env.PUBLIC_MAPBOX_STYLE}/static/pin-l+799A05(${data.location.lng},${data.location.lat})/${data.location.lng},${data.location.lat},15,0/800x450@2x?access_token=${process.env.STATIC_MAPBOX_TOKEN}`
  // const formatted = prettier.format(matter.stringify(content, data), { parser: 'markdown' })
  // fs.writeFileSync(filePath, formatted)
}
