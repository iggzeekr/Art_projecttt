import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type Visual = z.infer<typeof VisualSchema>;
export const VisualSchema = z.object({
  id: z.string(),
  name: z.string(),
  artist: z.string().nullable(),
  description: z.string(),
  url: z.string(),
  createdAt: z.date().nullable(),
});

export const GetVisualSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
