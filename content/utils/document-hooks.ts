import { RawBuilding } from '@/content/schema/Building';
import { RawTour } from '@/content/schema/Tour';
import { OnDocumentCreateOptions, StackbitConfig } from '@stackbit/types';
import { cloudinary } from './cloudinary';

/* ----- Hooks ----- */

export const onDocumentCreate: StackbitConfig['onDocumentCreate'] = async (options) => {
  let createOptions = { ...options.createDocumentOptions };
  await createCloudinaryFolder({ createOptions });
  return options.createDocument(createOptions);
};

/* ----- Actions ----- */

type CreateActionOptions = {
  createOptions: OnDocumentCreateOptions['createDocumentOptions'];
};

type CreateReturnType = OnDocumentCreateOptions['createDocumentOptions'];

type ModelType = RawBuilding['type'] | RawTour['type'];

const modelFolderMap: Record<ModelType, string> = {
  Building: 'buildings',
  Tour: 'tours',
};

async function createCloudinaryFolder(options: CreateActionOptions): Promise<CreateReturnType> {
  const { createOptions } = options;
  if (!['Building', 'Tour'].includes(createOptions.model.name)) return createOptions;
  const slugOp = createOptions.updateOperationFields._filePath_slug;
  if (!slugOp || !('value' in slugOp)) return createOptions;
  const slug = slugOp.value;
  const modelFolder = modelFolderMap[createOptions.model.name as ModelType];
  const folder = `${modelFolder}/${slug}`;
  await cloudinary.api.create_folder(folder);
  console.log(`Created Cloudinary folder: ${folder}`);
  return createOptions;
}
