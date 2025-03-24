import { makeGetRequest } from '../../utils/axios';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const notificationsListService = async (
  data: interfaces.INotificationsListParams
) => {
  const result: interfaces.INotificationsListResData = (
    await makeGetRequest(constants.NotificationsApiRoutes.base, data)
  ).data;

  return result.data;
};
