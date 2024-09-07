import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { authService } from '../auth/authService';
import { VisualRequest } from './visualDto';
import { GetVisualSchema, VisualSchema } from './visualModel';
import { visualService } from './visualService';

export const visualRegistry = new OpenAPIRegistry();

visualRegistry.register('Visual', VisualSchema);

export const visualRouter: Router = (() => {
  const router = express.Router();

  visualRegistry.registerPath({
    method: 'get',
    path: '/visuals',
    tags: ['Visual'],
    responses: createApiResponse(z.array(VisualSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await visualService.findAllAsync();
    handleServiceResponse(serviceResponse, res);
  });

  visualRegistry.registerPath({
    method: 'get',
    path: '/visual/{id}',
    tags: ['Visual'],
    request: { params: GetVisualSchema.shape.params },
    responses: createApiResponse(VisualSchema, 'Success'),
  });

  router.get('/:id', authService.authenticateToken, async (_req: Request, res: Response) => {
    const serviceResponse = await visualService.findByIdAsync(_req.params.id);
    handleServiceResponse(serviceResponse, res);
  });

  visualRegistry.registerPath({
    method: 'post',
    path: '/visual',
    tags: ['Visual'],
    responses: createApiResponse(VisualSchema, 'Success'),
  });

  router.post('/', authService.authenticateAdmin, async (_req: Request, res: Response) => {
    const { name, description, file, artist, createdAt } = _req.body as unknown as VisualRequest;
    if (!file) {
      res.status(400).send('File is required');
      return;
    }
    if (!name) {
      res.status(400).send('Name is required');
      return;
    }

    if (!description) {
      res.status(400).send('Description is required');
      return;
    }

    const serviceResponse = await visualService.uploadVisualAsync(
      name,
      description,
      file,
      artist || null,
      createdAt || null
    );
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
