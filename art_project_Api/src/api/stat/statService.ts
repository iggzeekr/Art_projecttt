import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';

import { visitRepository } from '../visit/visitRepository';
import { VisitReport } from './statModel';

export const statService = {
  getVisitReportAsync: async (
    startDate: Date,
    endDate: Date,
    interval: string
  ): Promise<ServiceResponse<VisitReport[]>> => {
    const visits = await visitRepository.getAllVisitsWithStartAndEndDates(startDate, endDate);
    visits.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const visitReport: VisitReport[] = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const nextDate = addHours(currentDate, intervalToHours(interval));
      const visit = visits.filter(
        (v) => v.createdAt.getTime() >= currentDate.getTime() && v.createdAt.getTime() < nextDate.getTime()
      );
      visitReport.push({
        startedAt: currentDate,
        endedAt: nextDate,
        totalVisits: visit.length,
        uniqueVisits: new Set(visit.map((v) => v.userId)).size,
      });
      currentDate = nextDate;
    }

    return new ServiceResponse(ResponseStatus.Success, 'Visit Report found', visitReport, StatusCodes.OK);
  },
};

export const addHours = (date: Date, hours: number): Date => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

export const intervalToHours = (interval: string): number => {
  switch (interval) {
    case 'hour':
      return 1;
    case 'day':
      return 24;
    case 'week':
      return 24 * 7;
    case 'month':
      return 24 * 30;
    default:
      return 1;
  }
};
