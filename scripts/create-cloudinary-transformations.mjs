import { v2 as cloudinary } from 'cloudinary'

/* --- Constants --- */

const TRANSFORMATIONS = {
  '16_9_large': { width: 1200, height: 675, crop: 'fill', gravity: 'auto' },
  square_small: { width: 100, height: 100, crop: 'fill', gravity: 'auto' },
}

/* --- Helper Functions --- */

async function getTransformations() {
  return new Promise((resolve, reject) => {
    cloudinary.api.transformations({}, (err, result) => {
      if (err) return reject(err)
      resolve(result.transformations)
    })
  })
}

async function deleteTransformation(name) {
  return new Promise((resolve) => {
    cloudinary.api.delete_transformation(name, (err, result) => {
      if (err) {
        console.log(`[Error] ${err.message}`)
        return resolve()
      }
      console.log(`[Delete] ${name}`)
      resolve(result)
    })
  })
}

async function deleteTransformations() {
  const transformations = await getTransformations()
  for (const transformation of transformations) {
    await deleteTransformation(transformation.name)
  }
}

async function createTransformation(name, options) {
  return new Promise((resolve, reject) => {
    cloudinary.api.create_transformation(
      name,
      { ...options, allowed_for_strict: true },
      (err, result) => {
        if (err) return reject(err)
        console.log(`[Create] ${name}`)
        resolve(result)
      },
    )
  })
}

/* --- Runner --- */

await deleteTransformations()

for (const [name, options] of Object.entries(TRANSFORMATIONS)) {
  await createTransformation(name, options)
}
