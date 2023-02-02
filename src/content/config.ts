import { z, defineCollection } from 'astro:content'

const buildingsCollection = defineCollection({
  schema: z
    .object({
      title: z.string(),
    })
    .required({ title: true }),
})

const toursCollection = defineCollection({
  schema: z
    .object({
      title: z.string(),
    })
    .required({ title: true }),
})

export const collections = {
  buildings: buildingsCollection,
  tours: toursCollection,
}
