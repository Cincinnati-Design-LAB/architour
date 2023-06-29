TODO:

Phase 1:

- [✔️] Introduce map component
- [✔️] Generate static maps with Mapbox
  - [✔️] For buildings
  - [✔️] For tours
- [✔️] Use `srcset` and `sizes` attributes to provide responsive images
  - [✔️] Will need to generate multiple sizes of images
- [✔️] Introduce Link component that:
  - [✔️] Detects external links and adds `target="_blank" rel="noopener noreferrer"` and an icon
  - [✔️] Provide styling options? -> I want to do the underlining and icon as component variations under `src/components/Link` so that Link is a wrapper around all of them, and the external link is functional, but can optionally wrap itself with an icon. There are some two-ways dependencies here.
- [✔️] Replace icons with consistent kit
- [✔️] Remove icons from tours (or make them optional)
- [✔️] Fix tour building images and cards
- [✔️] Insecure content warning on Netlify. I think this is because of the
- [✔️] Content structure adjustments
  - [✔️] Make attributes more flexible
  - [✔️] `date_of_completion` -> `completion_date`
  - [✔️] Convert existing content
  - [✔️] Put in publishing mechanism (draft mode)
  - [✔️] Should not be able to publish without core attributes
  - [✔️] Figure out what to do with renovation history and make adjustments
    - Put a placeholder in there for now, and going through every building before going live
  - [✔️] When not in edit mode, a tour should not attach draft or invalid buildings
  - [✔️] Show that there are validation errors when in edit mode
- [✔️] Add analytics -> Installed, but need to wait for data collection and then
  can test link tracking
- [✔️] Static map cleanup
  - [✔️] Address overlay on the building map
  - [✔️] Hover state for tour map
  - [✔️] Process static images for all buildings
  - [✔️] Process static images for all tours
  - [✔️] Tour static map should use production mode

Stackbit:

- [✔️] Set up Stackbit
- [✔️] Model with Stackbit
- [✔️] Add inline editing for tours and buildings
- [✔️] Inline editing for list pages
- [✔️] Only the bare minimum required fields
- [ ] Method for editing/adding images
  - [ ] I think the way to do this is to mimic the stackbit behavior in some way. Use the same modal, but get more detailed with the folder we're loading.
- [ ] Get automatic content reloading working
- [ ] Extend field for page location (use shared definition)
- [ ] Extend field for icon (Tour)
- [ ] Simplify `preview` where it is used (look for `TODO` — talk to Simon)
- [✔️] Move header content into JSON files
  - [✔️] With inline editing
- [✔️] Move footer content into JSON files
  - [✔️] With inline editing
- [✔️] Model for the home page? I think it'd make the sitemap work a little nicer.
  - [✔️] With inline editing
- [✔️] Model and inline editing for building and tours list? (Could make part of site config.)
  - [✔️] Would be nice to have them in the sitemap, but they are hard-coded pages, so would have to use `sitemap` config property
- [ ] Method for setting the building location without hunting for coordinates
- [ ] Method for generating static map images (not all have them, but it is now tied to published items only)
  - Using an interactive method for setting the location would then kick off a series of events:
    1. Store the location on the file
    2. Generate static map, set cache and map on file
    3. Re-generate static map and cache for all associated tours
  - [ ] Should this happen locally or commit a change to GitHub?

Last Few UI Features:

- [ ] Fix mobile menu -> it looks stupid
- [✔️] List and link to tours on the building detail page
- [ ] Building list filtering and pagination

Pre-Launch Cleanup:

- [ ] Link component should be used in building body and attributes
- [ ] Add click tracking
- [ ] Responsive style check
- [ ] Upgrade Astro
- [ ] Inherit models with Contentlayer
  - A couple issues holding me back from doing this:
    - https://github.com/contentlayerdev/contentlayer/issues/438
    - https://github.com/contentlayerdev/contentlayer/issues/439

Post-Launch Options:

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
