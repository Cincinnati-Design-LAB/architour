import { Building } from '@/content/schema/Building.model';
import { BuildingAttribute } from '@/content/schema/BuildingAttribute.model';
import { BuildingAttributeSection } from '@/content/schema/BuildingAttributeSection.model';
import { BuildingRenovation } from '@/content/schema/BuildingRenovation.model';
import { BuildingRenovationSection } from '@/content/schema/BuildingRenovationSection.model';
import { Location } from '@/content/schema/Location.model';
import { models as SiteConfig } from '@/content/schema/SiteConfig.model';
import { Tour } from '@/content/schema/Tour.model';
import { GitContentSource } from '@stackbit/cms-git';
import { defineStackbitConfig } from '@stackbit/types';
import { assetSources } from './content/utils/asset-sources';
import { onDocumentCreate } from './content/utils/document-hooks';

const models = [
  Building,
  BuildingAttribute,
  BuildingAttributeSection,
  BuildingRenovation,
  BuildingRenovationSection,
  Location,
  ...SiteConfig,
  Tour,
];

const gitContentSource = new GitContentSource({
  rootPath: __dirname,
  contentDirs: ['content/buildings', 'content/data', 'content/tours'],
  models,
  assetsConfig: {
    referenceType: 'static',
    staticDir: 'public',
    uploadDir: 'uploads',
    publicPath: '/',
  },
});

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  nodeVersion: '18',
  contentSources: [gitContentSource],
  onDocumentCreate,
  devCommand: 'yarn npm-run-all -p content:watch "astro:dev -- --port {PORT}"',
  experimental: {
    ssg: {
      name: 'Astro',
      logPatterns: { up: ['is ready', 'astro'] },
      directRoutes: { 'socket.io': 'socket.io' },
      passthrough: ['/vite-hmr/**'],
    },
  },
  assetSources: Object.values(assetSources),
  sidebarButtons: [
    {
      label: 'Site Settings',
      modelName: 'SiteConfig',
      type: 'model',
      icon: 'add-new',
      srcType: gitContentSource.getContentSourceType(),
      srcProjectId: gitContentSource.getProjectId(),
    },
  ],
});
