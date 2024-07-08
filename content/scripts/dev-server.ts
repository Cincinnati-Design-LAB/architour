import { CONTENT_DIR, ROOT_DIR } from '@/content/utils/constants';
import { generateContentCache } from '@/content/utils/generators';
import chokidar from 'chokidar';
import path from 'path';

const watchPattern = path.join(CONTENT_DIR, '**/*.md');

const watcher = chokidar.watch(watchPattern, { ignoreInitial: true });

function getRelativePath(filePath: string) {
  return path.relative(ROOT_DIR, filePath);
}

watcher
  .on('add', async (filePath) => {
    console.log('[create]', getRelativePath(filePath));
    await generateContentCache();
  })
  .on('change', async (filePath) => {
    console.log('[update]', getRelativePath(filePath));
    await generateContentCache();
  })
  .on('unlink', async (filePath) => {
    console.log('[delete]', getRelativePath(filePath));
    await generateContentCache();
  })
  .on('error', async (error) => {
    console.error('[error]', error);
  });

// Run on initial load
(async () => {
  await generateContentCache();
})();
