import { AssetSource } from '@stackbit/types';
import { cloudinary } from './cloudinary';

export type AssetSourceType = 'buildings' | 'tours';

/** Shape of the data returned from the asset application. */
export type AssetData = {
  public_id: string;
  width: number;
  height: number;
  url: string;
};

function buildAssetSource(folder?: string): AssetSource {
  return {
    name: `architour-cloudinary-assets${folder ? `-${folder}` : ''}`,
    type: 'iframe',
    url: process.env.IMAGE_UPLOADER_BASE_URL + (folder || ''),
    transform: ({ assetData }: { assetData: AssetData }) => assetData.public_id,
    preview: ({ assetData }: { assetData: string }) => {
      const image = cloudinary.url(assetData, {
        width: 700,
        height: 324,
        crop: 'fill',
        secure: true,
      });
      return { image };
    },
  };
}

export const assetSources: Record<AssetSourceType, AssetSource> = {
  buildings: buildAssetSource('buildings'),
  tours: buildAssetSource('tours'),
};
