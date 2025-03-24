import {
  makeGetRequest,
  makePostRequest,
  makePutRequest,
} from '../../utils/axios';

import * as interfaces from './interfaces';
import * as constants from './constants';
import { generateDynamicPath } from '../../utils/common';
import { apiURLV1 } from '../../config';

export const profileGetService = async () => {
  const result: interfaces.IProfileGetResData = (
    await makeGetRequest(constants.Routes.profileGet)
  ).data;

  return result.data.user;
};

export const passwordUpdateService = async (
  data: interfaces.IPasswordUpdateReqData
) => {
  const result: interfaces.IPasswordUpdateResData = (
    await makePostRequest(constants.Routes.passwordUpdate, data)
  ).data;

  return result;
};

export const profileUpdateService = async (
  data: interfaces.IProfileUpdateReqData
) => {
  const result: interfaces.IProfileUpdateResData = (
    await makePutRequest(constants.Routes.profileUpdate, data)
  ).data;

  return result;
};

export const addBankService = async (
  email: string, // Assuming email is a string
  type: string,
  primaryUserId: string,
): Promise<any> => {
  const url = "stripe/generate-link";
  console.log(url);

  const result = await makePostRequest(
    `${apiURLV1}/${url}`,
    { email, type, primaryUserId } // Pass email and type as an object in the request body
  );

  return result.data;
};