import moment from 'moment';

import { Colors } from '../../constants';
import { IModuleKind } from '../../interfaces';
import { generateJobDetailsPath } from '../Jobs/utils';

import * as interfaces from './interfaces';

export const parseCalendarEvents = (
  calendarEvents: interfaces.ICalendarEventTypes[]
) => {
  //generateJobDetailsPath
  const result = calendarEvents.map((calendarEvent, index) => {
    let { title, redirectionPath } = calendarEvent;

    if (calendarEvent.kind === IModuleKind.jobs) {
      redirectionPath = generateJobDetailsPath(calendarEvent.jobId);

      title = `${title} (${calendarEvent.address.formatted})`;
    }

    return {
      ...calendarEvent,
      title,
      color: Colors[index % 10],
      start: moment.utc(calendarEvent.startDt).toDate(),
      end: moment.utc(calendarEvent.endDt).toDate(),
      label: 'label',
      redirectionPath,
    };
  });

  return result;
};
