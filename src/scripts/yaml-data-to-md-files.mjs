/**
 * This was used to convert original YAML data files into MD files in
 * src/content.
 */

import fs from 'fs'
import glob from 'fast-glob'
import path from 'path'
import prettier from 'prettier'
import yaml from 'js-yaml'

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

function formatFileContent(frontmatter) {
  let output = `---\n${yaml.dump(frontmatter)}---\n\n`
  return prettier.format(output, { parser: 'markdown' })
}

function yamlToMarkdown() {
  const yamlFilePaths = glob.sync(path.join(CONTENT_DIR, '**/*.yml'))

  for (const filePath of yamlFilePaths) {
    const yamlData = yaml.load(fs.readFileSync(filePath), 'utf8')
    const mdContent = formatFileContent(yamlData)
    const newFilePath = filePath.replace(/\.yml$/, '.md')
    fs.writeFileSync(newFilePath, mdContent)
    fs.unlinkSync(filePath)
  }
}

// ---------------------------------------- | Script Runners

yamlToMarkdown()
