import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';

import { Visit, VisitRequest } from './visitModel';
import { visitRepository } from './visitRepository';

export const visitService = {
  findAll: async (): Promise<ServiceResponse<Visit[] | null>> => {
    const result = (await visitRepository.findAllAsync()) as Visit[] | null;
    if (!result) {
      return new ServiceResponse(ResponseStatus.Success, 'No Visits found', null, StatusCodes.OK);
    }
    return new ServiceResponse(ResponseStatus.Success, 'Visits found', result, StatusCodes.OK);
  },

  findById: async (id: number): Promise<ServiceResponse<Visit | null>> => {
    const result = await visitRepository.findByIdAsync(id);
    if (!result) {
      return new ServiceResponse(ResponseStatus.Failed, 'Visit not found', null, StatusCodes.NOT_FOUND);
    }
    return new ServiceResponse(ResponseStatus.Success, 'Visit found', result, StatusCodes.OK);
  },

  create: async (visit: VisitRequest): Promise<ServiceResponse<Visit | null>> => {
    const visitModel = {
      id: await visitRepository.getNewId(),
      userId: visit.userId,
      createdAt: visit.createdAt || new Date(),
      updatedAt: visit.updatedAt || new Date(),
    } as Visit;

    const result = await visitRepository.createAsync(visitModel);
    if (!result) {
      return new ServiceResponse(ResponseStatus.Failed, 'Visit not created', null, StatusCodes.BAD_REQUEST);
    }
    return new ServiceResponse(ResponseStatus.Success, 'Visit created', result, StatusCodes.CREATED);
  },
};
