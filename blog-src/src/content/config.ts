import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

// Starlight 会自动管理 docs collection 的 schema
export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
};
