import { makeGetRequest } from '../../utils/axios';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const calendarEventsListService = async () => {
  let result: interfaces.ICalendarEventsListResData = (
    await makeGetRequest(constants.CalendarEventApiRoutes.base, [])
  ).data;

  return result.data.records;
};
