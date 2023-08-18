TODO:

Last Few UI Features:

- [ ] Fix mobile menu -> it looks stupid
- [✔️] List and link to tours on the building detail page
- [ ] Building list filtering and pagination
- [✔️] Custom 404 page

Pre-Launch Cleanup:

- [ ] Link component should be used in building body and attributes
- [ ] Add click tracking
- [ ] Responsive style check
- [ ] Upgrade Astro
- [ ] Extend field for icon (Tour)
- [ ] Ensure that updating a location updates the static map in a cloud project
- [ ] Mapbox map doesn't load in Stackbit

Post-Launch Options:

- [ ] Get automatic content reloading working
- [ ] Simplify `preview` where it is used (look for `TODO` — talk to Simon)
- [ ] Replace Contentlayer with a custom mechanism
- [ ] Consider putting the image variation complexity in component
  - [ ] Consider if Unpic can help
  - [ ] Generate dimension ratio transformations (original, square, landscape)
  - [ ] Generate URLs for widths every `100` pixels from `100` to `4000`
  - [ ] ResponsiveImage component should be fed the sizes and automatically add DPR

Notes to add:

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
  - Remove Contentlayer
- Cloudinary folder gets automatically created when creating new tour or building
