import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import https from 'https'
import prettier from 'prettier'
import matter from 'gray-matter'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const TMP_DIR = path.join(process.cwd(), 'tmp')
const IMAGE_BASENAME = 'static-map'
const PRETTIER_OPTIONS = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), '.prettierrc'), 'utf8'),
)

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
 * Deletes all assets that start with the prefix in a Cloudinary folder
 *
 * @param cloudinaryDir Name of folder (prefix) in Cloudinary to find static
 * maps to delete
 * @returns Array of public IDs of deleted assets
 */
async function deleteStaticMapImages(cloudinaryDir: string): Promise<string[]> {
  // Retrieve assets in Cloudinary folder
  const { resources } = await cloudinary.api.resources({
    type: 'upload',
    prefix: cloudinaryDir,
  })
  // Filter out assets that don't start with the prefix, and get the public IDs
  const publicIds = resources
    .map((r) => r.public_id)
    .filter((r) => path.basename(r).startsWith(IMAGE_BASENAME))
  // Delete assets
  if (publicIds.length) await cloudinary.api.delete_resources(publicIds)
  return publicIds
}

/* --- Buildings --- */

for (const filePath of glob.sync(path.join(CONTENT_DIR, 'buildings/**/*.md'))) {
  const { data, content } = matter.read(filePath)
  if (!data.location) continue

  // Cloudinary directory name reference. This matches how we're storing images
  // elsewhere.
  const slug = path.basename(filePath, '.md')
  const cloudinaryDir = `buildings/${slug}`

  // Cache key to know whether we should update the static map URL. We use the
  // location because it's the only thing that can change the static map.
  const newCacheKey = JSON.stringify(data.location)

  // Skip if we've already generated this static map, which means that there is
  // a URL for it and the cache key matches the current location.
  const hasUpdatedImage =
    data.static_map_url && data.static_map_url.length > 0 && newCacheKey === data.static_map_cache
  if (hasUpdatedImage) continue

  // Delete old static map images for this building
  await deleteStaticMapImages(cloudinaryDir)

  // Create static map URL
  const smUrl = {
    lat: data.location.lat,
    lng: data.location.lng,
    style: process.env.PUBLIC_MAPBOX_STYLE,
    token: process.env.STATIC_MAPBOX_TOKEN,
    markerUrl: encodeURIComponent('https://architour.netlify.app/MapMarker.png'),
  }
  const newStaticMapUrl = `https://api.mapbox.com/styles/v1/${smUrl.style}/static/url-${smUrl.markerUrl}(${data.location.lng},${data.location.lat})/${data.location.lng},${data.location.lat},15,0/800x450@2x?access_token=${smUrl.token}`

  // Download static map image
  const filename = IMAGE_BASENAME + '.png'
  const cachedImage = await downloadImage(newStaticMapUrl, filename)

  // Upload to Cloudinary
  const cloudinaryResult = await uploadImage(cachedImage, cloudinaryDir)

  // Store reference to Cloudinary URL in data
  data.static_map_url = cloudinaryResult.public_id
  // Store cache key for next time
  data.static_map_cache = newCacheKey

  // Write new content to file
  const formatted = prettier.format(matter.stringify(content, data), {
    ...PRETTIER_OPTIONS,
    parser: 'markdown',
  })
  fs.writeFileSync(filePath, formatted)

  // Provide feedback
  console.log(`[Building] New static map: ${data.title}`)
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

  // TODO: Use these coordinates to add markers to a static map, and do the same
  // process as above

  // TODO: Consider if there are other abstractions between this and the above.

  // data.static_map_url = `https://api.mapbox.com/styles/v1/${process.env.PUBLIC_MAPBOX_STYLE}/static/pin-l+799A05(${data.location.lng},${data.location.lat})/${data.location.lng},${data.location.lat},15,0/800x450@2x?access_token=${process.env.STATIC_MAPBOX_TOKEN}`
  // const formatted = prettier.format(matter.stringify(content, data), { parser: 'markdown' })
  // fs.writeFileSync(filePath, formatted)
}
