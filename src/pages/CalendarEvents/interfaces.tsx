import { ICommonResponse, IModuleKind, ICommonAddress } from '../../interfaces';

export interface IJobCalendarEvent {
  id: string;
  kind: IModuleKind.jobs;
  jobId: string;
  title: string;
  startDt: string; //UTC
  endDt: string; //UTC
  address: ICommonAddress;

  //  Added at FrontEnd
  color: string;

  start: Date;
  end: Date;

  redirectionPath: string;
}

export type ICalendarEventTypes = IJobCalendarEvent;

export interface ICalendarEventsListResData extends ICommonResponse {
  data: {
    records: ICalendarEventTypes[];
  };
}
