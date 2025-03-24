import { apiURLV1 } from '../../config';

import { generateDynamicPath } from '../../utils/common';
import {
  makeDeleteRequest,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
} from '../../utils/axios';

import { IIntegrationCommonSubModuleTypes } from '../Orgs/interfaces';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const integrationCommonListAllService = async () => {
  const result: interfaces.IntegrationCommonListAllResData = (
    await makeGetRequest(constants.IntegrationCommonApiRoutes.listAll)
  ).data;

  return result.data.list;
};

export const integrationCommonListService = async (
  kind: IIntegrationCommonSubModuleTypes,
  data: interfaces.IntegrationCommonListReqData
) => {
  const url = generateDynamicPath(constants.IntegrationCommonApiRoutes.list, {
    kind,
  });

  const result: interfaces.IntegrationCommonListResData = (
    await makeGetRequest(`${apiURLV1}/${url}`, {
      params: data,
    })
  ).data;

  return result.data;
};

export const integrationCommonAddService = async (
  kind: IIntegrationCommonSubModuleTypes,
  data: interfaces.IntegrationCommonCreateEditReqData
) => {
  const url = generateDynamicPath(constants.IntegrationCommonApiRoutes.add, {
    kind,
  });

  const result: interfaces.IIntegrationCommonCreateEditResData = (
    await makePostRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};

export const integrationCommonDeleteService = async (
  kind: IIntegrationCommonSubModuleTypes,
  integrationCommonId: string
) => {
  const url = generateDynamicPath(constants.IntegrationCommonApiRoutes.delete, {
    kind,
    integrationCommonId,
  });

  const result: interfaces.IIntegrationCommonCreateEditResData = (
    await makeDeleteRequest(`${apiURLV1}/${url}`)
  ).data;

  return result;
};

export const integrationCommonEditService = async (
  kind: IIntegrationCommonSubModuleTypes,
  integrationCommonId: string,
  data: interfaces.IntegrationCommonCreateEditReqData
) => {
  const url = generateDynamicPath(constants.IntegrationCommonApiRoutes.edit, {
    kind,
    integrationCommonId,
  });

  const result: interfaces.IIntegrationCommonCreateEditResData = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};

export const integrationCommonBlockUnblockService = async (
  kind: IIntegrationCommonSubModuleTypes,
  integrationCommonId: string,
  isActive: boolean
) => {
  const url = generateDynamicPath(
    constants.IntegrationCommonApiRoutes.blockUnblock,
    {
      kind,
      integrationCommonId,
    }
  );

  const result: interfaces.IIntegrationCommonCreateEditResData = (
    await makePutRequest(`${apiURLV1}/${url}`, {
      isActive,
    })
  ).data;

  return result;
};
