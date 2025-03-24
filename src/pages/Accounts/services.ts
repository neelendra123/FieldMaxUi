import { apiURLV1 } from '../../config';

import { makeGetRequest, makePutRequest } from '../../utils/axios';
import { generateDynamicPath } from '../../utils/common';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const accountEditService = async (
  accountId: string,
  data: interfaces.IAccountEditReqData
) => {
  const url = generateDynamicPath(constants.AccountApiRoutes.accountEdit, {
    accountId,
  });

  const result: interfaces.IAccountResData = (
    await makePutRequest(`${apiURLV1}/${url}`, data, undefined, accountId)
  ).data;

  return result;
};

export const accountDetailsService = async (accountId: string) => {
  const url = generateDynamicPath(constants.AccountApiRoutes.accountDetails, {
    accountId,
  });

  const result: interfaces.IAccountResData = (
    await makeGetRequest(`${apiURLV1}/${url}`)
  ).data;

  return result.data.account;
};
