import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isAdmin: z.boolean().default(false),
  token: z.string().optional(),
});
