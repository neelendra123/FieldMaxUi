import { makeGetRequest } from '../../utils/axios';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const dashboardHomeService = async () => {
  const result: interfaces.IDashboardHomeResData = (
    await makeGetRequest(constants.DashboardApiRoutes.home)
  ).data;

  return result.data.counts;
};
