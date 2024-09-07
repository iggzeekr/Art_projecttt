import { z } from 'zod';

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export const LoginResponseSchema = z.object({
  token: z.string(),
});
