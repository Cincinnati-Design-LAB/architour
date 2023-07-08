import { AssetSource } from '@stackbit/types'
import { cloudinary } from './cloudinary'

export type AssetSourceType = 'buildings' | 'tours'

function buildAssetSource(folder?: string): AssetSource {
  return {
    name: `architour-cloudinary-assets${folder ? `-${folder}` : ''}`,
    type: 'iframe',
    url: process.env.IMAGE_UPLOADER_BASE_URL + (folder || ''),
    transform: ({
      assetData,
    }: {
      assetData: { public_id: string; width: number; height: number; url: string }
    }) => {
      // const { public_id, width, height, url } = assetData
      // return { public_id, width, height, url }
      return assetData.public_id
    },
    // TODO: Make the image smaller
    // TODO: Use the type from the schema.
    // TODO: Also use that same type above.
    preview: ({ assetData }: { assetData: string }) => {
      const image = cloudinary.url(assetData, {
        width: 500,
        height: 324,
        crop: 'fill',
        secure: true,
      })
      return { image }
    },
  }
}

export const assetSources: Record<AssetSourceType, AssetSource> = {
  buildings: buildAssetSource('buildings'),
  tours: buildAssetSource('tours'),
}
