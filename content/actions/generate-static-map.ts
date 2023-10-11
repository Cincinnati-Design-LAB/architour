import {
  CustomActionField,
  Document,
  DocumentField,
  DocumentWithSource,
  ModelWithSource,
  UpdateOperationField,
} from '@stackbit/types';
import { UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import https from 'https';
import streamifier from 'streamifier';

type CustomActionOptions = Parameters<CustomActionField['run']>[0];

export const generateStaticMap: CustomActionField['run'] = async (options) => {
  const document = getDocument(options);
  const model = getModel(options);
  const slug = getDocumentSlug(document);
  // TODO: Delete old static map images for this building

  const staticMapUrl = generateStaticMapUrl(document, model);

  const image = await uploadImage(staticMapUrl, `buildings/${slug}`);

  await updateStaticMapReference(image.public_id, options);

  // options.contentSourceActions.updateDocument

  // TODO: Store reference to Cloudinary URL in data
  // TODO: Remove cache key
  // TODO: Do the same thing for tours
};

/* --- Cloudinary Helpers --- */

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
      filename_override: 'static-map',
      use_filename: true,
    };
    const uploadCallback = (error, result) => (error ? reject(error) : resolve(result));
    let cloudinaryUploadStream = cloudinary.uploader.upload_stream(uploadOptions, uploadCallback);

    streamifier.createReadStream(buffer).pipe(cloudinaryUploadStream);
  });
}

/* --- Map Helpers --- */

function generateStaticMapUrl(document: DocumentWithSource, model: ModelWithSource): string {
  if (model.name === 'Building') return generateStaticBuildingMapUrl(document);
  // if (model.name === 'Tour') return generateStaticTourMapUrl(document);
  throw new Error('Invalid model');
}

function generateStaticBuildingMapUrl(document: DocumentWithSource): string {
  const { lat, lng, markerUrl, style, token } = {
    lat: getFieldValue(document, ['location', 'lat']),
    lng: getFieldValue(document, ['location', 'lng']),
    style: process.env.PUBLIC_MAPBOX_STYLE,
    token: process.env.STATIC_MAPBOX_TOKEN,
    markerUrl: encodeURIComponent('https://architour.netlify.app/MapMarker.png'),
  };
  return `https://api.mapbox.com/styles/v1/${style}/static/url-${markerUrl}(${lng},${lat})/${lng},${lat},15,0/800x450@2x?access_token=${token}`;
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
