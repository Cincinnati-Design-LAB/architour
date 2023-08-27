import { generateContentCache } from '@/content/utils/generators';
import { getBuildings } from '@content';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

(async () => {
  await generateContentCache();

  const allBuildings = await getBuildings();

  const validBuildings = allBuildings.filter((building) => {
    return (building.validation_errors || []).length === 0;
  });

  for (const building of validBuildings) {
    const srcFilePath = path.join(process.cwd(), building.stackbit_id);
    const { content, data } = matter.read(srcFilePath);
    data.draft = false;
    fs.writeFileSync(srcFilePath, matter.stringify(content, data));
  }
})();
