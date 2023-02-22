import { makeSource } from 'contentlayer/source-files'

import { Building } from './src/content/schema/Building'
import { Tour } from './src/content/schema/Tour'

export default makeSource({
  contentDirPath: 'src/content',
  documentTypes: [Building, Tour],
})
