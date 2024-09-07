import { Visual } from './visualModel';

const visuals: Visual[] = [];

export const visualRepository = {
  uploadVisualAsync: async (visual: Visual): Promise<Visual> => {
    visuals.push(visual);
    return visual;
  },

  findAllAsync: async (): Promise<Visual[]> => {
    return visuals;
  },

  findByIdAsync: async (id: string): Promise<Visual | null> => {
    return visuals.find((visual) => visual.id === id) || null;
  },
};
