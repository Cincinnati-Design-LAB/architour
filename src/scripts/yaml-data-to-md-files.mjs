/**
 * This was used to convert original YAML data files into MD files in
 * src/content.
 */

import fs from 'fs'
import glob from 'fast-glob'
import matter from 'gray-matter'
import path from 'path'
import prettier from 'prettier'
import yaml from 'js-yaml'

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

/**
 * Formats frontmatter object into a Markdown string that can be written to a
 * file.
 *
 * @param {object} frontmatter Frontmatter object to be converted to MD
 * @returns Markdown string
 */
function formatFileContent(frontmatter, body) {
  let output = `---\n${yaml.dump(frontmatter)}---\n\n`
  if (body) output += body.trim() + '\n'
  return prettier.format(output, { parser: 'markdown' })
}

/**
 * Convert all YAML files in src/content to MD files, with the same properties.
 */
function convertYamlFilesToMarkdown() {
  const yamlFilePaths = glob.sync(path.join(CONTENT_DIR, '**/*.yml'))

  for (const filePath of yamlFilePaths) {
    const yamlData = yaml.load(fs.readFileSync(filePath), 'utf8')
    const mdContent = formatFileContent(yamlData)
    const newFilePath = filePath.replace(/\.yml$/, '.md')
    fs.writeFileSync(newFilePath, mdContent)
    fs.unlinkSync(filePath)
  }
}

/**
 * Break up building body back into properties.
 */
function convertBuildingBodyToProperties() {
  const bldgFilePaths = glob.sync(path.join(CONTENT_DIR, 'buildings/*.md'))

  for (const filePath of bldgFilePaths) {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContent)
    if (!data.body) continue

    // Split body into lines, trim whitespace, and remove empty lines
    const bodyLines = data.body.split('\n').map((line) => line.trim())
    bodyLines.reduce((acc, line) => {
      // If line starts with '###', it's a new property (all properties were
      // <h3> elements).
      if (line.startsWith('###')) {
        // Set the current property and give it a code-friendly name
        acc.property = line
          .replace(/^###\s*/, '')
          .toLowerCase()
          .replace(/ /g, '_')
        // Unset the current value.
        acc.value = undefined
      } else if (acc.property) {
        // If we're in a property, add the line to the value.
        acc.value = acc.value ? `${acc.value}\n${line}` : line
        // Set the property on the frontmatter object.
        data[acc.property] = acc.value.trim()
      }
      return acc
    }, {})

    delete data.body
    delete data.name // This is a duplicate of title

    // Write the new file content.
    const mdContent = formatFileContent(data)
    fs.writeFileSync(filePath, mdContent)
  }
}

// ---------------------------------------- | Script Runners

convertYamlFilesToMarkdown()
convertBuildingBodyToProperties()
