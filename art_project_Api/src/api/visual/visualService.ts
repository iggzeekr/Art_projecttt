import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { fileStorage } from '@/service/fileStorage';

import { Visual } from './visualModel';
import { visualRepository } from './visualRepository';

export const visualService = {
  uploadVisualAsync: async (
    name: string,
    description: string,
    file: string,
    artist: string | null,
    createdAt: Date | null
  ): Promise<ServiceResponse<Visual>> => {
    // create uuid
    const uuid = uuidv4();
    const fileInstance = new File([file], `${uuid}.png`, { type: 'image/png' });
    const url = await fileStorage.uploadFileAsync(fileInstance);
    const visual: Visual = {
      id: uuid,
      name,
      description,
      artist,
      createdAt,
      url,
    };

    const data = await visualRepository.uploadVisualAsync(visual);
    return new ServiceResponse(ResponseStatus.Success, 'Visual uploaded', data, StatusCodes.CREATED);
  },

  findAllAsync: async (): Promise<ServiceResponse<Visual[]>> => {
    const data = await visualRepository.findAllAsync();
    return new ServiceResponse(ResponseStatus.Success, 'Visual retrieved', data, StatusCodes.CREATED);
  },

  findByIdAsync: async (id: string): Promise<ServiceResponse<Visual | null>> => {
    const data = await visualRepository.findByIdAsync(id);
    return new ServiceResponse(ResponseStatus.Success, 'Visual retrieved', data, StatusCodes.CREATED);
  },
};
