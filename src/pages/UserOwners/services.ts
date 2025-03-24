import { apiURLV1 } from '../../config';
import { ICommonResponse } from '../../interfaces';

import {
  makeDeleteRequest,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
} from '../../utils/axios';
import { generateDynamicPath } from '../../utils/common';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const userOwnersListService = async (
  data: interfaces.IUserOwnersListReqData
) => {
  const result: interfaces.IUserOwnersListResData = (
    await makeGetRequest(constants.UserOwnerApiRoutes.base, data)
  ).data;

  return result.data;
};

export const userOwnerCreateService = async (
  data: interfaces.IUserOwnerCreateReqData
) => {
  const result: interfaces.IUserOwnersCommonResData = (
    await makePostRequest(constants.UserOwnerApiRoutes.base, data)
  ).data;

  return result;
};

export const userOwnersListAllService = async () => {
  const result: interfaces.IUserOwnerListAllResData = (
    await makeGetRequest(constants.UserOwnerApiRoutes.listAll)
  ).data;

  return result.data.records;
};

export const userOwnerBlockService = async (
  userOwnerId: string,
  isActive: boolean
) => {
  const url = generateDynamicPath(constants.UserOwnerApiRoutes.blockUnblock, {
    userOwnerId,
  });

  const result: ICommonResponse = (
    await makePutRequest(`${apiURLV1}/${url}`, {
      isActive,
    })
  ).data;

  return result;
};

export const userOwnerDeleteService = async (userOwnerId: string) => {
  const url = generateDynamicPath(constants.UserOwnerApiRoutes.delete, {
    userOwnerId,
  });

  const result: ICommonResponse = (
    await makeDeleteRequest(`${apiURLV1}/${url}`)
  ).data;

  return result;
};

export const userOwnerInviteService = async (userOwnerId: string) => {
  const url = generateDynamicPath(constants.UserOwnerApiRoutes.invite, {
    userOwnerId,
  });

  const result: ICommonResponse = (await makePutRequest(`${apiURLV1}/${url}`))
    .data;

  return result;
};

export const userOwnerDetailsService = async (userOwnerId: string) => {
  const url = generateDynamicPath(constants.UserOwnerApiRoutes.details, {
    userOwnerId,
  });

  const result: interfaces.IUserOwnersCommonResData = (
    await makeGetRequest(`${apiURLV1}/${url}`)
  ).data;

  return result.data.record;
};

export const userOwnerEditService = async (
  userOwnerId: string,
  data: interfaces.IUserOwnerEditReqData
) => {
  const url = generateDynamicPath(constants.UserOwnerApiRoutes.edit, {
    userOwnerId,
  });

  const result: interfaces.IUserOwnersCommonResData = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};
