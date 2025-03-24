import { apiURLV1 } from '../../config';

import { makeGetRequest, makePostRequest } from '../../utils/axios';
import { generateDynamicPath } from '../../utils/common';

import { IAuthResData } from '../Auth/interfaces';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const inviteDetailsService = async (token: string) => {
  const url = generateDynamicPath(constants.InviteApiRoutes.inviteBase, {
    token,
  });

  let result: interfaces.IInviteDecodeJWTRes = (
    await makeGetRequest(`${apiURLV1}/${url}`, {}, { skipAuth: true })
  ).data;

  return result.data;
};

export const inviteRegisterService = async (
  data: interfaces.InviteNewUserReqData
) => {
  let result: IAuthResData = (
    await makePostRequest(constants.InviteApiRoutes.inviteRegister, data, {
      skipAuth: true,
    })
  ).data;

  return result;
};

export const inviteStatusUpdateService = async (
  data: interfaces.IInviteStatusUpdateService
) => {
  const url = generateDynamicPath(constants.InviteApiRoutes.inviteBase, {
    token: data.token,
  });

  let result: interfaces.InviteUpdateRes = (
    await makePostRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};
