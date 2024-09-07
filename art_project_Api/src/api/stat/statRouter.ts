import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response } from 'express';
import { z } from 'zod';

import { statService } from '@/api/stat/statService'; // Import the statService
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { GetVisitReportSchema, VisitReportSchema } from './statModel';

export const statRegistry = new OpenAPIRegistry();
statRegistry.register('Stat', VisitReportSchema);

export const statRouter = (() => {
  const router = express.Router();

  statRegistry.registerPath({
    method: 'get',
    path: '/stats/visit-report/{startDate}/{endDate}/{interval}',
    tags: ['Stat'],
    request: { query: GetVisitReportSchema.shape.query },
    responses: createApiResponse(z.array(VisitReportSchema), 'Success'),
  });

  router.get('/', validateRequest(GetVisitReportSchema), async (_req: Request, res: Response) => {
    const { startDate, endDate, interval } = _req.query as unknown as {
      startDate: Date;
      endDate: Date;
      interval: 'hour' | 'day' | 'week' | 'month';
    };
    const serviceResponse = await statService.getVisitReportAsync(startDate, endDate ?? new Date(), interval);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
