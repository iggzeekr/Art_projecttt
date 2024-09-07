import { z } from 'zod';

export type VisitReport = z.infer<typeof VisitReportSchema>;
export const VisitReportSchema = z.object({
  startedAt: z.date(),
  endedAt: z.date(),
  totalVisits: z.number(),
  uniqueVisits: z.number(),
});

export const GetVisitReportSchema = z.object({
  query: z
    .object({
      startDate: z.date({
        message: 'startDate should be a date',
      }),
      endDate: z.date().optional(),
      interval: z.enum(['hour', 'day', 'week', 'month']).default('hour'),
    })
    .refine((data) => data.endDate && data.startDate < data.endDate, {
      message: 'startDate should be earlier than endDate',
    })
    .refine(
      (data) =>
        data.interval === 'hour' || data.interval === 'day' || data.interval === 'week' || data.interval === 'month',
      {
        message: 'interval should be one of hour, day, week, month',
      }
    )
    .innerType(),
});
