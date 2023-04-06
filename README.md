TODO:

Phase 1:

- [✔️] Introduce map component
- [✔️] Generate static maps with Mapbox
  - [✔️] For buildings
  - [✔️] For tours
- [✔️] Use `srcset` and `sizes` attributes to provide responsive images
  - [✔️] Will need to generate multiple sizes of images
- [ ] Move header and footer content into JSON files
- [ ] Introduce Link component that:
  - [x] Detects external links and adds `target="_blank" rel="noopener noreferrer"` and an icon
  - [ ] Provide styling options? -> I want to do the underlining and icon as component variations under `src/components/Link` so that Link is a wrapper around all of them, and the external link is functional, but can optionally wrap itself with an icon. There are some two-ways dependencies here.
- [ ] Responsive styles
- [ ] Building list filtering and pagination
- [ ] Way to get back from PageHeader?
- [ ] Add renovation history to buildings
- [ ] What to do with additional fields we're not using
- [ ] Add analytics, including click tracking
- [ ] Static map cleanup
  - [ ] Address overlay on the building map
  - [ ] Hover state for tour map
  - [ ] Process static images for all buildings
  - [ ] Process static images for all tours
- [✔️] Insecure content warning on Netlify. I think this is because of the
  Cloudinary images.
- [ ] Fix mobile menu -> it looks stupid

Phase 2:

- [ ] Model with Stackbit
- [ ] Integrate Stackbit
- [ ] Method for editing/adding images
- [ ] Method for generating static map images

Phase 3:

- [ ] Replace Contentlayer with a custom mechanism
- [ ] Consider putting the image variation complexity in component
  - [ ] Generate dimension ratio transformations (original, square, landscape)
  - [ ] Generate URLs for widths every `100` pixels from `100` to `4000`
  - [ ] ResponsiveImage component should be fed the sizes and automatically add DPR
