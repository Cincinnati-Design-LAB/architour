import { defineStackbitConfig } from '@stackbit/types'
import { GitContentSource } from '@stackbit/cms-git'

import { models } from './content/stackbit'

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['content'],
      models,
      // assetsConfig: {
      //   referenceType: 'static',
      //   staticDir: 'public',
      //   uploadDir: 'uploads',
      //   publicPath: '/',
      // },
    }),
  ],
  // experimental: {
  //   ssg: {
  //     name: 'astro',
  //     logPatterns: { up: ['Server running at'] },
  //     passthrough: ['/vite-hmr/**'],
  //   },
  // },
})
