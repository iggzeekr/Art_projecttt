import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { LoginResponseSchema } from './authDto';
import { User, UserSchema } from './authModels';
import { authService } from './authService';

export const authRegistry = new OpenAPIRegistry();
authRegistry.register('User', UserSchema);

export const authRouter: Router = (() => {
  const router = express.Router();

  authRegistry.registerPath({
    method: 'post',
    path: '/register',
    tags: ['Register'],
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.post('/register', async (_req: Request, res: Response) => {
    const serviceResponse = await authService.register(_req.body as unknown as User);
    handleServiceResponse(serviceResponse, res);
  });

  authRegistry.registerPath({
    method: 'post',
    path: '/login',
    tags: ['Login'],
    responses: createApiResponse(LoginResponseSchema, 'Success'),
  });

  router.post('/login', async (_req: Request, res: Response) => {
    const { email, password } = _req.body as unknown as { email: string; password: string };
    const serviceResponse = await authService.login(email, password);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
