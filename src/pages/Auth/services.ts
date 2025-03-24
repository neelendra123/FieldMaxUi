import { apiURLV1 } from '../../config';
import { ApiCommonURLs } from '../../constants';

import { makeGetRequest, makePostRequest } from '../../utils/axios';
import { generateDynamicPath } from '../../utils/common';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const passwordResetGetService = async (token: string) => {
  const url = generateDynamicPath(ApiCommonURLs.decodeJWT, {
    token,
  });

  const result: interfaces.IResetPasswordJWTResData = (
    await makeGetRequest(
      `${apiURLV1}/${url}`,
      {},
      {
        skipAuth: true,
      }
    )
  ).data;

  return result;
};

export const passwordResetPostService = async (
  data: interfaces.IPasswordResetReqData
) => {
  const result: interfaces.IPasswordResetResData = (
    await makePostRequest(constants.AuthApiRoutes.passwordReset, data, {
      skipAuth: true,
    })
  ).data;

  return result;
};

export const passwordForgotService = async (
  data: interfaces.IPasswordForgotReqData
) => {
  const result: interfaces.IPasswordForgotResData = (
    await makePostRequest(constants.AuthApiRoutes.passwordForgot, data, {
      skipAuth: true,
    })
  ).data;

  return result;
};

export const loginService = async (data: interfaces.ILoginReqData) => {
  const result: interfaces.IAuthResData = (
    await makePostRequest(constants.AuthApiRoutes.login, data, {
      skipAuth: true,
    })
  ).data;

  return result;
};

export const registerService = async (data: interfaces.IRegisterReqData) => {
  const result: interfaces.IAuthResData = (
    await makePostRequest(constants.AuthApiRoutes.register, data, {
      skipAuth: true,
    })
  ).data;

  return result;
};

export const logoutService = async () => {
  await makePostRequest(
    constants.AuthApiRoutes.logout,
    {},
    {
      skipAuth: false,
      skipErrorMsg: true,
    }
  );
};
