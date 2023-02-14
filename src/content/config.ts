import { z, defineCollection } from 'astro:content'

const buildingsCollection = defineCollection({
  schema: z.object({
    title: z.string().nonempty(),
    images: z.array(z.string()),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    address: z.optional(z.string()),
    original_owner: z.optional(z.string()),
    current_owner: z.optional(z.string()),
    date_of_completion: z.optional(z.string()),
    style: z.optional(z.string()),
    architect: z.optional(z.string()),
    contractor: z.optional(z.string()),
    original_function: z.optional(z.string()),
    significance: z.optional(z.string()),
    historic_status: z.optional(z.string()),
    unique_features: z.optional(z.string()),
    renovations: z.optional(z.string()),
    renovation_date: z.optional(z.string()),
    renovation_architect: z.optional(z.string()),
  }),
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
