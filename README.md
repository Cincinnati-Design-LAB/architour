TODO:

Phase 1:

- [✔️] Introduce map component
- [✔️] Generate static maps with Mapbox
  - [✔️] For buildings
  - [✔️] For tours
- [✔️] Use `srcset` and `sizes` attributes to provide responsive images
  - [✔️] Will need to generate multiple sizes of images
- [ ] Move header and footer content into JSON files
- [✔️] Introduce Link component that:
  - [✔️] Detects external links and adds `target="_blank" rel="noopener noreferrer"` and an icon
  - [✔️] Provide styling options? -> I want to do the underlining and icon as component variations under `src/components/Link` so that Link is a wrapper around all of them, and the external link is functional, but can optionally wrap itself with an icon. There are some two-ways dependencies here.
- [✔️] Replace icons with consistent kit
- [✔️] Remove icons from tours (or make them optional)
- [✔️] Fix tour building images and cards
- [✔️] Insecure content warning on Netlify. I think this is because of the
- [ ] Content structure adjustments
  - [✔️] Make attributes more flexible
  - [✔️] `date_of_completion` -> `completion_date`
  - [✔️] Convert existing content
  - [✔️] Put in publishing mechanism (draft mode)
  - [ ] Should not be able to publish without core attributes
  - [✔️] Figure out what to do with renovation history and make adjustments
    - Put a placeholder in there for now, and going through every building before going live
  - [✔️] When not in edit mode, a tour should not attach draft or invalid buildings
  - [ ] Show that there are validation errors when in edit mode
- [ ] Responsive styles
- [ ] Building list filtering and pagination
- [ ] Way to get back from PageHeader?
- [✔️] Add analytics -> Installed, but need to wait for data collection and then
  can test link tracking
  - [ ] Add click tracking
- [ ] Static map cleanup
  - [✔️] Address overlay on the building map
  - [✔️] Hover state for tour map
  - [✔️] Process static images for all buildings
  - [✔️] Process static images for all tours
  - [✔️] Tour static map should use production mode
  - [ ] What to do when static map doesn't exist?
    - Need to consider when static map should be populated.
    - Every commit on `preview` is too much.
    - Manually pushing a button is prone to error.
    - Before publish doesn't give editor previewing options for attributes.
- [ ] Fix mobile menu -> it looks stupid
- [ ] List and link to tours on the building detail page

Phase 2:

- [ ] Model with Stackbit
- [ ] Integrate Stackbit
- [ ] Only the bare minimum required fields
- [ ] Method for editing/adding images
- [ ] Method for generating static map images (not all have them, but it is now tied to published items only)
- [ ] Link component should be used in building body and attributes

Phase 3:

- [ ] Replace Contentlayer with a custom mechanism
- [ ] Consider putting the image variation complexity in component
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
