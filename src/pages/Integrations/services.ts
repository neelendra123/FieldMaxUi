import {
  makeDeleteRequest,
  makePostRequest,
  makePutRequest,
} from '../../utils/axios';
import { generateDynamicPath } from '../../utils/common';

import { apiURLV1 } from '../../config';
import { ICommonResponse } from '../../interfaces';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const rmCredentialsUpdateService = async (
  data: interfaces.IRMCredentialsUpdateReqData
) => {
  const result: interfaces.IIntegrationResData = (
    await makePutRequest(constants.IntegrationsApiRoutes.rentManager, data)
  ).data;

  return result;
};

export const rmDefaultLocationUpdate = async (locationId: number) => {
  const url = generateDynamicPath(
    constants.IntegrationsApiRoutes.rmLocationDefault,
    {
      locationId: `${locationId}`,
    }
  );
    console.log("Dynamic path: "+url);
  const result: interfaces.IIntegrationResData = (
    await makePutRequest(`${apiURLV1}/${url}`)
  ).data;

  return result;
};

export const rmDisableSync = async () => {
  const result: interfaces.IIntegrationResData = (
    await makeDeleteRequest(constants.IntegrationsApiRoutes.rentManager)
  ).data;

  return result;
};

export const rmSync = async () => {
  const result: ICommonResponse = (
    await makePostRequest(constants.IntegrationsApiRoutes.rentManagerSync)
  ).data;

  return result;
};
