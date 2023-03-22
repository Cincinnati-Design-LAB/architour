import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import https from 'https'
import prettier from 'prettier'
import matter from 'gray-matter'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const IMAGE_BASENAME = 'static-map'
const MAP_MARKER_URL = encodeURIComponent('https://architour.netlify.app/MapMarker.png')
const PRETTIER_OPTIONS = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), '.prettierrc'), 'utf8'),
)
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
 * Downloads static map from Mapbox, then uploads the local file to Cloudinary
 *
 * @param imageUrl URL to the static map from Mapbox
 * @param folder Name of folder in Cloudinary to add file
 * @returns Result from Cloudinary upload
 */
async function uploadImage(imageUrl: string, folder: string): Promise<UploadApiResponse> {
  const cachedImage = await downloadImage(imageUrl, IMAGE_BASENAME + '.png')
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(cachedImage, { folder, use_filename: true }, (err, result) => {
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

/**
 * Writes updated data to a source file
 *
 * @param filePath Absolute path to file on disk
 * @param content String content of file (this shouldn't have been manipulated)
 * @param data New data object to write to file
 */
function updateSourceFile(filePath: string, content: string, data: Record<string, any>): void {
  const formatted = prettier.format(matter.stringify(content, data), {
    ...PRETTIER_OPTIONS,
    parser: 'markdown',
  })
  fs.writeFileSync(filePath, formatted)
}

/**
 * Compares data in the source file against a new cache key to determine if the
 * image is current or needs to be updated.
 *
 * @param data Frontmatter from source file
 * @param newCacheKey New cache key to compare against (this is different for
 * each type of content)
 * @returns true if the image is current, false if it needs to be replaced
 */
function hasCurrentImage(data: Record<string, any>, newCacheKey: string): boolean {
  return (
    data.static_map_url && data.static_map_url.length > 0 && newCacheKey === data.static_map_cache
  )
}

/**
 * Handles the entire processing for a static map image. Deletes any existing
 * images (that start with the prefix), uploads the new image, and updates the
 * source file with the new public_id and cache key.
 */
async function updateStaticMapImage({
  filePath,
  content,
  data,
  newStaticMapUrl,
  newCacheKey,
  cloudinaryDir,
}: {
  filePath: string
  content: string
  data: Record<string, any>
  newStaticMapUrl: string
  newCacheKey: string
  cloudinaryDir: string
}): Promise<void> {
  // Delete old static map images for this building
  await deleteStaticMapImages(cloudinaryDir)
  // Upload static map to Cloudinary
  const cloudinaryResult = await uploadImage(newStaticMapUrl, cloudinaryDir)
  // Store reference to Cloudinary URL in data
  data.static_map_url = cloudinaryResult.public_id
  // Store cache key for next time
  data.static_map_cache = newCacheKey
  // Write new content to file
  updateSourceFile(filePath, content, data)
  // Provide feedback
  console.log(`[Building] New static map: ${data.title}`)
}

/* --- Buildings --- */

for (const filePath of glob.sync(path.join(CONTENT_DIR, 'buildings/**/*.md'))) {
  const { data, content } = matter.read(filePath)

  // Skip if there is no location (since we won't be able to generate a static
  // map).
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
  if (hasCurrentImage(data, newCacheKey)) continue

  // Create static map URL
  const smUrl = {
    lat: data.location.lat,
    lng: data.location.lng,
    style: process.env.PUBLIC_MAPBOX_STYLE,
    token: process.env.STATIC_MAPBOX_TOKEN,
    markerUrl: MAP_MARKER_URL,
  }
  const newStaticMapUrl = `https://api.mapbox.com/styles/v1/${smUrl.style}/static/url-${smUrl.markerUrl}(${data.location.lng},${data.location.lat})/${data.location.lng},${data.location.lat},15,0/800x450@2x?access_token=${smUrl.token}`

  // Process new static map image and store in the source file.
  await updateStaticMapImage({
    filePath,
    content,
    data,
    newStaticMapUrl,
    newCacheKey,
    cloudinaryDir,
  })
}

/* --- Tours --- */

for (const filePath of glob.sync(path.join(CONTENT_DIR, 'tours/**/*.md'))) {
  const { data, content } = matter.read(filePath)
  if (!data.buildings || data.buildings.length === 0) continue

  // Cloudinary directory name reference. This matches how we're storing images
  // elsewhere.
  const slug = path.basename(filePath, '.md')
  const cloudinaryDir = `tours/${slug}`

  // Get all the locations for the buildings in this tour
  const markerCoords = data.buildings
    .map((relFilePath) => matter.read(path.join(CONTENT_DIR, relFilePath)).data.location)
    .filter(Boolean)

  // Cache key to know whether we should update the static map URL. We use the
  // location because it's the only thing that can change the static map.
  const newCacheKey = JSON.stringify(markerCoords)

  // Skip if we've already generated this static map, which means that there is
  // a URL for it and the cache key matches the current location.
  if (hasCurrentImage(data, newCacheKey)) continue

  // Create static map URL
  const smUrl = {
    style: process.env.PUBLIC_MAPBOX_STYLE,
    token: process.env.STATIC_MAPBOX_TOKEN,
    markers: markerCoords.map((loc) => `url-${MAP_MARKER_URL}(${loc.lng},${loc.lat})`).join(','),
  }
  const newStaticMapUrl = `https://api.mapbox.com/styles/v1/${smUrl.style}/static/${smUrl.markers}/auto/800x450@2x?padding=20&access_token=${smUrl.token}`

  // Process new static map image and store in the source file.
  await updateStaticMapImage({
    filePath,
    content,
    data,
    newStaticMapUrl,
    newCacheKey,
    cloudinaryDir,
  })
}
