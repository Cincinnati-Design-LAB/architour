import fs from 'fs';
import path from 'path';

// When in editor mode, draft content is shown and validations are displayed on
// the screen. Otherwise, we don't show draft content and validation failures
// throw errors.
export const EDITOR_MODE = process.env.EDITOR_MODE === 'true';

export const ROOT_DIR = process.cwd();
export const CONTENT_DIR = path.join(ROOT_DIR, 'content');
export const BUILDINGS_DIR = path.join(CONTENT_DIR, 'buildings');
export const TOURS_DIR = path.join(CONTENT_DIR, 'tours');
export const DATA_DIR = path.join(CONTENT_DIR, 'data');

export const CACHE_DIR = path.join(CONTENT_DIR, 'generated');
export const BUILDINGS_CACHE_DIR = path.join(CACHE_DIR, 'buildings');
export const TOURS_CACHE_DIR = path.join(CACHE_DIR, 'tours');
export const DATA_CACHE_DIR = path.join(CACHE_DIR, 'data');

// Prettier
export const PRETTIER_CONFIG = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, '.prettierrc'), 'utf8'),
);
