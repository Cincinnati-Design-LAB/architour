import { getTransformationDprVariations, TRANSFORMATIONS } from '@/content/utils/images';
import { v2 as cloudinary } from 'cloudinary';

/**
 * This script deleted all existing Cloudinary named transformations, and then
 * creates a new set, based on the TRANSFORMATIONS object in
 * content/utils/images.ts.
 */

/* --- Types --- */

type ImageTransformationResult = {
  name: string;
  allowed_for_strict: boolean;
  used: boolean;
  named: boolean;
};

/* --- Helper Functions --- */

async function getTransformations(): Promise<ImageTransformationResult[]> {
  return new Promise((resolve, reject) => {
    cloudinary.api.transformations({}, (err, result) => {
      if (err) return reject(err);
      resolve(result.transformations as ImageTransformationResult[]);
    });
  });
}

async function deleteTransformation(name): Promise<void> {
  return new Promise((resolve) => {
    cloudinary.api.delete_transformation(name, (err, result) => {
      if (err) {
        console.log(`[Error] ${err.message}`);
        return resolve();
      }
      console.log(`[Delete] ${name}`);
      resolve(result);
    });
  });
}

async function deleteTransformations() {
  const transformations = await getTransformations();
  for (const transformation of transformations) {
    await deleteTransformation(transformation.name);
  }
}

async function createTransformation(name, options) {
  return new Promise((resolve, reject) => {
    cloudinary.api.create_transformation(
      name,
      { ...options, allowed_for_strict: true },
      (err, result) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log(`[Create] ${name}`);
        resolve(result);
      },
    );
  });
}

/* --- Runner --- */

(async () => {
  await deleteTransformations();

  for (const t of TRANSFORMATIONS) {
    for (const { name, options } of getTransformationDprVariations(t.name, t.options)) {
      await createTransformation(name, options);
    }
  }
})();
