import { Visit } from './visitModel';

export const visits: Visit[] = [
  {
    id: 1,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    userId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const visitRepository = {
  findAllAsync: async (): Promise<Visit[]> => {
    return visits;
  },

  findByIdAsync: async (id: number): Promise<Visit | null> => {
    return visits.find((visit) => visit.id === id) || null;
  },

  createAsync: async (visit: Visit): Promise<Visit> => {
    visits.push(visit);
    return visit;
  },

  getAllVisitsWithStartAndEndDates: async (startDate: Date, endDate: Date): Promise<Visit[]> => {
    return visits.filter((visit) => visit.createdAt >= startDate && visit.createdAt <= endDate);
  },

  getNewId: async (): Promise<number> => {
    return visits.length + 1;
  },
};
