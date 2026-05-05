import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'post/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        cover: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).default([])
      })
    })
  }
})
