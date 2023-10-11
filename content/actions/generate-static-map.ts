import {
  CustomActionField,
  Document,
  DocumentField,
  DocumentWithSource,
  ModelWithSource,
  UpdateOperationField,
} from '@stackbit/types';
import { UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import console from 'console';
import https from 'https';
import path from 'path';
import streamifier from 'streamifier';

/* --- Setup --- */

const IMAGE_BASENAME = 'static-map';
const MAP_MARKER_URL = encodeURIComponent('https://architour.netlify.app/MapMarker.png');

/* --- Action --- */

type CustomActionOptions = Parameters<CustomActionField['run']>[0];

export const generateStaticMap: CustomActionField['run'] = async (options) => {
  const document = getDocument(options);
  const model = getModel(options);
  const folder = getFolderPath(document, model);
  // Delete existing static map images
  await deleteStaticMapImages(folder);
  // Generate new static map image, upload, and update document
  const staticMapUrl = generateStaticMapUrl(options);
  const image = await uploadImage(staticMapUrl, folder);
  await updateStaticMapReference(image.public_id, options);

  // TODO: Remove the workflow
  // TODO: Remove cache key
  // TODO: Fix the building type
};

/* --- Cloudinary Helpers --- */

/**
 * Generates a path to the appropriate building folder based on the current
 * model.
 */
function getFolderPath(document: DocumentWithSource, model: ModelWithSource): string {
  const slug = getDocumentSlug(document);
  if (model.name === 'Building') return `buildings/${slug}`;
  if (model.name === 'Tour') return `tours/${slug}`;
  throw new Error('Invalid model');
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
  const { resources } = await cloudinary.api.resources({ type: 'upload', prefix: cloudinaryDir });
  // Filter out assets that don't start with the prefix, and get the public IDs
  const publicIds = resources
    .map((r) => r.public_id)
    .filter((r) => path.basename(r).startsWith(IMAGE_BASENAME));
  // Delete assets
  if (publicIds.length) await cloudinary.api.delete_resources(publicIds);
  return publicIds;
}

/**
 * Downloads an image to buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const data = [];
    https
      .get(url, (res) => {
        res
          .on('data', (chunk) => data.push(chunk))
          .on('end', () => {
            let buffer = Buffer.concat(data);
            resolve(buffer);
          });
      })
      .on('error', (err) => {
        console.error('download error:', err);
        reject(err);
      });
  });
}

/**
 * Downloads static map from Mapbox, then uploads the local file to Cloudinary
 *
 * @param imageUrl URL to the static map from Mapbox
 * @param folder Name of folder in Cloudinary to add file
 * @returns Result from Cloudinary upload
 */
async function uploadImage(imageUrl: string, folder: string): Promise<UploadApiResponse> {
  return new Promise(async (resolve, reject) => {
    const buffer = await downloadImage(imageUrl);

    const uploadOptions: UploadApiOptions = {
      folder,
      filename_override: IMAGE_BASENAME,
      use_filename: true,
    };
    const uploadCallback = (error, result) => (error ? reject(error) : resolve(result));
    let cloudinaryUploadStream = cloudinary.uploader.upload_stream(uploadOptions, uploadCallback);

    streamifier.createReadStream(buffer).pipe(cloudinaryUploadStream);
  });
}

/* --- Map Helpers --- */

/**
 * Controls calling the proper function to generate the proper static map URL
 */
function generateStaticMapUrl(options: CustomActionOptions): string {
  const document = getDocument(options);
  const model = getModel(options);
  if (model.name === 'Building') return generateStaticBuildingMapUrl(document);
  if (model.name === 'Tour') return generateStaticTourMapUrl(document, options);
  throw new Error('Invalid model');
}

function generateStaticBuildingMapUrl(document: DocumentWithSource): string {
  const { lat, lng, markerUrl, style, token } = {
    lat: getFieldValue(document, ['location', 'lat']),
    lng: getFieldValue(document, ['location', 'lng']),
    style: process.env.PUBLIC_MAPBOX_STYLE,
    token: process.env.STATIC_MAPBOX_TOKEN,
    markerUrl: MAP_MARKER_URL,
  };
  return `https://api.mapbox.com/styles/v1/${style}/static/url-${markerUrl}(${lng},${lat})/${lng},${lat},15,0/800x450@2x?access_token=${token}`;
}

function generateStaticTourMapUrl(
  document: DocumentWithSource,
  options: CustomActionOptions,
): string {
  const allBuildings = options.getDocuments().filter((d) => d.modelName === 'Building');
  const buildingIds = getFieldValue(document, ['building_ids']).map((f) => f.refId);
  const buildings = allBuildings.filter((b) => buildingIds.includes(b.id));
  const markers = buildings
    .map((building) => {
      const lat = getFieldValue(building, ['location', 'lat']);
      const lng = getFieldValue(building, ['location', 'lng']);
      return `url-${MAP_MARKER_URL}(${lng},${lat})`;
    })
    .join(',');
  const style = process.env.PUBLIC_MAPBOX_STYLE;
  const token = process.env.STATIC_MAPBOX_TOKEN;
  return `https://api.mapbox.com/styles/v1/${style}/static/${markers}/auto/800x450@2x?padding=20&access_token=${token}`;
}

/* --- Document Helpers --- */

/**
 * Update the document with the Cloudinary public ID for the static map.
 *
 * This accepts the bulk options object from the custom action. It assumes it's
 * being called after checks have been made. More specifically, it assumes:
 * - The document exists
 * - The model exists
 * - The model has a `static_map` field
 */
async function updateStaticMapReference(public_id: string, options: CustomActionOptions) {
  const document = getDocument(options);
  const model = getModel(options);
  const modelField = model.fields.find((f) => f.name === 'static_map');

  await options.contentSourceActions.updateDocument({
    document,
    userContext: options.getUserContextForContentSourceType(options.parentDocument.srcType),
    operations: [
      {
        opType: 'set',
        fieldPath: ['static_map'],
        modelField,
        field: { type: modelField.type, value: public_id } as UpdateOperationField,
      },
    ],
  });
}

/**
 * Retrieve document from options and throw an error if it doesn't exist
 */
function getDocument(options: CustomActionOptions): DocumentWithSource {
  const document = options.currentPageDocument;
  if (!document) throw new Error('Document not found');
  return document;
}

/**
 * Retrieve model from options and throw an error if it doesn't exist
 */
function getModel(options: CustomActionOptions): ModelWithSource {
  const model = options.parentModel;
  if (!model) throw new Error('Parent model not found');
  return model;
}

/**
 * Retrieve document slug from options and throw an error if it doesn't exist
 */
function getDocumentSlug(document: DocumentWithSource): string {
  const slugField = document.fields._filePath_slug;
  if ('value' in slugField) return slugField.value;
  throw new Error('Document slug not found');
}

/**
 * Extracts the value for a field from a document. This is useful for extracting
 * the value of a field from a document, particularly when working with nested
 * documents.
 */
export function getFieldValue(document: Document, fieldPath: Array<string | number>) {
  return fieldPath.reduce((prev, curr) => {
    return extractFieldValue(prev[curr] as DocumentField);
  }, document.fields);
}

/**
 * Determines the proper value to return from a varying field type.
 */
function extractFieldValue(field: DocumentField) {
  // If the current field is some sort of object, it will have a `fields`
  // property, which will be an object of key-value pairs.
  if ('fields' in field) return field.fields;
  // If the current field is a list, it will have an `items` property, which is
  // an array of fields.
  if ('items' in field) return field.items;
  // Otherwise, we assume we have a field from which we can send a direct value.
  if ('value' in field) return field.value;
  // If we don't have a value, we throw an error.
  console.error('Field does not have a value', field);
  throw new Error('Field does not have a value');
}
