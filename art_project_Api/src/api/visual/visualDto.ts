import { z } from 'zod';

export type VisualRequest = z.infer<typeof VisualRequestSchema>;
export const VisualRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  file: z.string(),
  artist: z.string().optional(),
  createdAt: z.date().optional(),
});
