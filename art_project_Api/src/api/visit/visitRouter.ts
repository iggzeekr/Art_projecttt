import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { authService } from '../auth/authService';
import { GetVisitSchema, VisitRequest, VisitRequestSchema, VisitSchema } from './visitModel';
import { visitService } from './visitService';

export const visitRegistry = new OpenAPIRegistry();

visitRegistry.register('Visit', VisitSchema);

export const visitRouter: Router = (() => {
  const router = express.Router();

  visitRegistry.registerPath({
    method: 'get',
    path: '/visit',
    tags: ['Visit'],
    responses: createApiResponse(z.array(VisitSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await visitService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  visitRegistry.registerPath({
    method: 'get',
    path: '/visit/{id}',
    tags: ['Visit'],
    request: { params: GetVisitSchema.shape.params },
    responses: createApiResponse(VisitSchema, 'Success'),
  });

  router.get('/:id', authService.authenticateToken, async (_req: Request, res: Response) => {
    const serviceResponse = await visitService.findById(parseInt(_req.params.id as string, 10));
    handleServiceResponse(serviceResponse, res);
  });

  visitRegistry.registerPath({
    method: 'post',
    path: '/visit',
    tags: ['Visit'],
    responses: createApiResponse(VisitRequestSchema, 'Success'),
  });

  router.post('/', authService.authenticateToken, async (_req: Request, res: Response) => {
    const serviceResponse = await visitService.create(_req.body as unknown as VisitRequest);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
