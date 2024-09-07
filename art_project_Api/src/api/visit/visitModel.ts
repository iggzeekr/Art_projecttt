import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

export type Visit = z.infer<typeof VisitSchema>;
export const VisitSchema = z.object({
  id: z.number(),
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetVisitSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export type VisitRequest = z.infer<typeof VisitRequestSchema>;
export const VisitRequestSchema = z.object({
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
