#!/usr/env/bin node

/**
 * This was a one-time script to convert the building attributes from individual
 * fields into the `sections` array.
 */

import glob from 'fast-glob';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ATTRIBUTE_MAP = {
  above_images: [
    { name: 'current_owner', label: 'Current Owner' },
    { name: 'historic_status', label: 'Historic Status' },
    { name: 'unique_features', label: 'Unique Features', layout: 'full_width' },
    { name: 'significance', label: 'Significance', layout: 'full_width' },
  ],
  below_images: [
    { name: 'associate_architect', label: 'Associate Architect' },
    { name: 'public_access', label: 'Public Access' },
    { name: 'resources', label: 'Resources' },
    { name: 'green_building_features', label: 'Green Building Features' },
    { name: 'quotes', label: 'Quotes', layout: 'full_width' },
    { name: 'photo_credit', label: 'Photo Credit' },
  ],
  above_map: [
    { name: 'original_owner', label: 'Original Owner' },
    { name: 'completion_date', label: 'Completion Date' },
    { name: 'original_function', label: 'Original Function' },
    { name: 'style', label: 'Style' },
    { name: 'architect', label: 'Architect' },
    { name: 'contractor', label: 'Contractor' },
  ],
};

const buildingFilePaths = await glob(path.join(process.cwd(), 'content/buildings/**/*.md'));

for (const srcFilePath of buildingFilePaths) {
  const rawContent = fs.readFileSync(srcFilePath, 'utf8');
  const { data, content } = matter(rawContent);

  // Skip if already converted.
  if (data.sections) continue;

  // Begin building a new data object.
  const newData = { ...data };

  // Build out new sections array.
  const buildSection = (pageLocation) => {
    const attributes = ATTRIBUTE_MAP[pageLocation];
    const section = {
      page_location: pageLocation,
      type: 'BuildingAttributeSection',
      attributes: [],
    };
    for (const attribute of attributes) {
      const { name, label, layout } = attribute;
      if (data[name]) {
        const attribute = { label, value: data[name] };
        if (layout) attribute.layout = layout;
        section.attributes.push(attribute);
        delete newData[name];
      }
    }
    return section;
  };

  const sections = [
    buildSection('above_images'),
    buildSection('below_images'),
    buildSection('above_map'),
  ].filter((section) => section.attributes.length > 0);

  // Add renovation section.
  if (data.renovations || data.renovation_changes || data.renovation_date) {
    const renovation = {
      title: data.renovations || data.renovation_changes || 'Renovation',
      date: data.renovation_date || '',
    };
    if (data.renovation_architect) renovation.architect = data.renovation_architect;
    if (data.renovation_contractor) renovation.contractor = data.renovation_contractor;
    if (data.renovation_style || data.renovation_changes) {
      renovation.description = [data.renovation_style, data.renovation_changes]
        .filter(Boolean)
        .join(' ');
    }
    sections.push({
      page_location: 'below_map',
      type: 'BuildingRenovationSection',
      title: 'Renovation History',
      renovations: [renovation],
    });
    delete newData.renovations;
    delete newData.renovation_date;
    delete newData.renovation_architect;
    delete newData.renovation_contractor;
    delete newData.renovation_style;
    delete newData.renovation_changes;
  }

  // Put into draft mode, which will prompt checking each building.
  newData.draft = true;

  // Preserve the completion date, which is used directly in some cases.
  if (data.completion_date) newData.completion_date = data.completion_date;

  // Store the sections date in a new field.
  newData.sections = sections;

  // Write the new data object back to the source file.
  fs.writeFileSync(srcFilePath, matter.stringify(content, newData));
}
