import { apiURLV1 } from '../../config';

import {
  makeDeleteRequest,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
} from '../../utils/axios';
import { generateDynamicPath } from '../../utils/common';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const emailUniqueService = async (email: string) => {
  let result: interfaces.IEmailUniqueResData = (
    await makeGetRequest(constants.UserApiRoutes.emailUnique, { email })
  ).data;

  return result.data.result;
};

export const userListAllService = async (
  data: interfaces.IUserListAllParams
): Promise<interfaces.IUserListAllRes[]> => {
  let result: interfaces.IUserListAllResData = (
    await makeGetRequest(constants.UserApiRoutes.listAll, data)
  ).data;

  return result.data.data;
};

export const userListService = async (data: interfaces.IUsersListReqData) => {
  const result: interfaces.IUsersListResData = (
    await makeGetRequest(constants.UserApiRoutes.base, data)
  ).data;

  return result.data;
};

export const userAddService = async (data: interfaces.IUserAddReqData) => {
  let result: interfaces.IUserAddResData = (
    await makePostRequest(constants.UserApiRoutes.base, data)
  ).data;

  return result;
};

export const userDeleteService = async (userId: string) => {
  const url = generateDynamicPath(constants.UserApiRoutes.user, {
    userId,
  });

  const result: interfaces.IUserDeleteResData = (
    await makeDeleteRequest(`${apiURLV1}/${url}`)
  ).data;

  return result;
};

export const userGetService = async (userId: string) => {
  const url = generateDynamicPath(constants.UserApiRoutes.user, {
    userId,
  });

  const result: interfaces.IUserGetResData = (
    await makeGetRequest(`${apiURLV1}/${url}`)
  ).data;

  return result.data.user;
};

export const userEditService = async (
  userId: string,
  data: interfaces.IUserEditReqData
) => {
  const url = generateDynamicPath(constants.UserApiRoutes.user, {
    userId,
  });

  const result: interfaces.IUserEditResData = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};

export const editBlockUserService = async (userId: string, block: boolean) => {
  const url = generateDynamicPath(constants.UserApiRoutes.blockUnblock, {
    userId,
  });

  const result: interfaces.IUserEditResData = (
    await makePutRequest(`${apiURLV1}/${url}`, {
      block,
    })
  ).data;

  return result;
};
