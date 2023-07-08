import { GitContentSource } from '@stackbit/cms-git'
import { defineStackbitConfig } from '@stackbit/types'

import { models } from './content/stackbit'
import { onDocumentCreate } from './content/utils/document-hooks'

const gitContentSource = new GitContentSource({
  rootPath: __dirname,
  contentDirs: ['content'],
  models,
  // assetsConfig: {
  //   referenceType: 'static',
  //   staticDir: 'public',
  //   uploadDir: 'uploads',
  //   publicPath: '/',
  // },
})

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  contentSources: [gitContentSource],
  onDocumentCreate,
  // experimental: {
  //   ssg: {
  //     name: 'astro',
  //     logPatterns: { up: ['Server running at'] },
  //     passthrough: ['/vite-hmr/**'],
  //   },
  // },
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
})
