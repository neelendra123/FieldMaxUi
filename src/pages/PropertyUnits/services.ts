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

export const propertyUnitCreateService = async (
  data: interfaces.IPropertyUnitCreateReqData
) => {
  const result: interfaces.IPropertyUnitCreateResData = (
    await makePostRequest(constants.PropertyUnitApiRoutes.base, data)
  ).data;

  return result;
};

export const propertyUnitsListAllService = async (
  data: interfaces.IPropertyUnitsListAllReqData
) => {
  const result: interfaces.IPropertyUnitsListAllResData = (
    await makeGetRequest(constants.PropertyUnitApiRoutes.listAll, data)
  ).data;

  return result.data.records;
};

export const propertyUnitDetailsService = async (
  propertyUnitId: string,
  data: {
    populateProperty?: boolean;
    populateJobs?: boolean;
  }
) => {
  const url = generateDynamicPath(constants.PropertyUnitApiRoutes.details, {
    propertyUnitId,
  });

  const result: interfaces.IPropertyUnitDetailsResData = (
    await makeGetRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data.record;
};

export const propertyUnitDeleteService = async (propertyUnitId: string) => {
  const url = generateDynamicPath(constants.PropertyUnitApiRoutes.delete, {
    propertyUnitId,
  });

  const result: ICommonResponse = (
    await makeDeleteRequest(`${apiURLV1}/${url}`)
  ).data;

  return result;
};

export const propertyUnitEditService = async (
  propertyUnitId: string,
  data: interfaces.IPropertyUnitEditReqData
) => {
  const url = generateDynamicPath(constants.PropertyUnitApiRoutes.edit, {
    propertyUnitId,
  });

  const result: interfaces.IPropertyUnitEditResData = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};
