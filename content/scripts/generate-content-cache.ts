import { generateBuildingCache, generateTourCache } from '@/content/utils/generators';
(async () => {
  await generateBuildingCache();
  await generateTourCache();
})();
