TODO: README notes to add ->

- How content is stored and retrieved
- Tools being used
- Working with images
- Validation process
  - What is required
  - What edit mode means
  - Assumptions that we can rely on detail pages to be the primary validator for required production attributes.
- How icons work -> splitting them up with definitions, how to add new icons
- Process for adding new fields or models
  1. Add SB schema, edit with content tab
  2. Add CL schema
  3. Transformer and transformed type
  4. Pull into templates
  5. Inline editing
- A list of things I'd like to clean up, but probably won't (without financial motivation)
  - (notes from above can move here)
  - Make annotations and typing consistent
  - Clean up interactions between links and buttons
- Cloudinary folder gets automatically created when creating new tour or building
- Environment variables (replace the `.env-sample` file)
  - Noting that CLOUDINARY_URL is also used by the Cloudinary API even though we don't specifically configure it
- Thumbnail fields -> coming from Figma and how to set up
- How static maps are generated (custom action now)
