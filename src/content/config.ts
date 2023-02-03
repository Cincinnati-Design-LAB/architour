import { z, defineCollection } from 'astro:content'

const buildingsCollection = defineCollection({
  schema: z.object({
    title: z.string().nonempty(),
    images: z.array(z.string()),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    address: z.string().optional(),
    original_owner: z.string().optional(),
    date_of_completion: z.string().optional(),
    style: z.string().optional(),
    architect: z.string().optional(),
    contractor: z.string().optional(),
    original_function: z.string().optional(),
    significance: z.string().optional(),
    historic_status: z.string().optional(),
    unique_features: z.string().optional(),
    renovations: z.string().optional(),
    renovation_date: z.string().optional(),
    renovation_architect: z.string().optional(),
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
