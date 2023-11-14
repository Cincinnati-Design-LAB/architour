# ArchiTour v2

A web-based site for displaying Cincinnati building information from Cincinnati Design LAB.

## Setup

Clone, then Install dependencies.

    yarn install

Set environment variables by copying `.envrc-sample` to `.envrc`. Set the values then allow after the change in the terminal. Values are better obtained from Stackbit, since it will have those needed for visual editing.

Start development server.

    yarn dev

### Visual Editing with Stackbit

Install Stackbit CLI

    npm install -g @stackbit/cli@latest

With Astro dev server running, start the Stackbit server.

    stackbit dev --host localhost

Note that Stackbit changes rapidly. If enough time has passed, it's likely that the CLI will come out of sync with the other Stackbit packages used. You may have to update those and then debug.

    yarn add -D @stackbit/cms-git@latest @stackbit/types@latest

(Also note that the process may be different once Stackbit is fully integrated with Netlify.)

## Content Mechanism

There is a custom content mechanism in this project that is slightly different than what I've done in contemporary projects and where I'm going with what I'm currently calling Reuben. This project is likely to remain unique.

### Storing Content

All text content is stored in the `content` directory as JSON files. (More on images below.)

The models representing the shape of that content is defined as Stackbit schema files in `content/schema`. Each model should have an accompanying `.d.ts` file that defines the _raw_ shape (as it is stored in the JSON source file) and the _transformed_ shape (after generated and when used by the front end).

Content can be edited directly, but because content editors are going to use Stackbit, it's usually best to go through the visual system.

### How Content is Retrieved

There is a content biuld script that kicks off a content build.

    yarn content:generate-cache

This ultimately gets to the `content/utils/generators.ts` file and calls `generateContentCache()`. This method fetches all the raw source files and runs them through a transformer. Transformers live alongside their model definitions in `content/schema`.

When in development, there is a script that watches for changes. This is automatically run in parallel with the Astro development server when running `yarn dev`.

### Handling Images

Images are stored in Cloudinary. References to images are stored as string values representing the `public_id` in Cloudinary.

Images are managed and uploaded through Stackbit using a custom asset source. Custom asset sources are surfaced through a modal, which in this case is an iframe wrapper around the [assets manager app](https://github.com/Cincinnati-Design-LAB/architour-assets).

During transformation, image URLs are manipulated using Cloudinary APIs to present them in a series of sizes that can be used by the front end.

There's also a hook (`content/utils/document-hooks.ts`) that handles creating a new Cloudinary folder when a new tour or building is created through Stackbit. This is where we expect the images to be uploaded to.

### Static Map Images

Static map images on building and tour detail pages can be generated through a custom action in Stackbit (`content/actions/generate-static-map.ts`).

This process automatically deletes the old map, generates a new one, uploads to the proper directory on Cloudinary, and stores the `public_id` reference on the document.

### Publishing & Content Validation

Buildings and tours both have a draft mode designed to enable editors to use this system to accumulate information about buildings and to design tours over time.

The validation system is designed to protect against something half-baked getting into production. When in editing mode (`EDITOR_MODE` environment variable is set to `true`), validation errors are attached as a property to these objects, and the errors are surfaced in the preview UI. When building for production (`EDITOR_MODE` is unset \_not\_\_ `true`), validation errors will fail the content build.

### Icons

Icons are collections of SVG code that are rendered as individual component (or through the shared Icon component). But they also have a data portion to facilitate choosing icons in dynamic situations.

While this code represents the usable icon code, we try to use Figma as a source of truth for the icon artwork. In this way, the structure of icons stays consistent and they are easier to style.

When adding a new icon:

1. Add the new value to array of names in the utility (`content/utils/icons.ts`)
2. Create the Astro component (`src/components/Icon/...`) and drop in the SVG code.
3. Add the Component to the map in `src/components/Icon.astro`.

### Thumbnail Fields

Thumbnail fields were created to make the editing process smoother. Like icons, the source of truth for these files live in Figma. They are surfaced in this project in `.stackbit/thumbnails` and use a helper to load the options dynamically. (The values still need to be added to the appropriate types manually.)

## Outstanding Optimizations

There are a few ideas I wanted to capture that I likely won't work on without additional financial motivation. All issues to be addressed should be surfaced through GitHub issues.

### Links & Buttons

Links and buttons are intertwined in a fairly ugly way. I want to clean these up, but it's a scenario with a lot of nested logic and will require reworking the entire thought process. It works now and is unlikely to change in any significant way, so I'm leaving it as it.

### Content Mechanism

The content mechanism needs to work in production and serve editors efficiently in Stackbit. If it can do that, then it's doing the job, and I'm unlikely to make any adjustments to it.

Ideally, I'd replace it with whatever the result of my work on the Reuben PoC becomes. Knowing that's a long way off from being usable (and may never be) and knowing it would be a major refactor, we're going to stick with what we have here and rely on documentation to cover the basics of this relatively simple site.

### Better Typing

Ideally, this would get a little stronger with how we're using TypeScript, particularly with annotations. They are good enough to provide confidence now, so I'll leave them as is.
