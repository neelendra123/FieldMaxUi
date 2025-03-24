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

export const propertiesListService = async (
  data: interfaces.IPropertiesListReqData
) => {
  const result: interfaces.IPropertiesListResData = (
    await makeGetRequest(constants.PropertyApiRoutes.base, data)
  ).data;

  return result.data;
};

export const propertyAddService = async (
  data: interfaces.IPropertyAddReqData
) => {
  const result: interfaces.IPropertyAddResData = (
    await makePostRequest(constants.PropertyApiRoutes.base, data)
  ).data;

  return result;
};

export const propertiesListAllService = async (
  search = '',
  googlePlaces = false
) => {
  const result: interfaces.IPropertyListAllResData = (
    await makeGetRequest(constants.PropertyApiRoutes.listAll, {
      search,
      googlePlaces,
    })
  ).data;

  return result.data;
};

export const propertyBlockService = async (
  propertyId: string,
  isActive: boolean
) => {
  const url = generateDynamicPath(constants.PropertyApiRoutes.blockUnblock, {
    propertyId,
  });

  const result: ICommonResponse = (
    await makePutRequest(`${apiURLV1}/${url}`, {
      isActive,
    })
  ).data;

  return result;
};

export const propertyDeleteService = async (propertyId: string) => {
  const url = generateDynamicPath(constants.PropertyApiRoutes.delete, {
    propertyId,
  });

  const result: ICommonResponse = (
    await makeDeleteRequest(`${apiURLV1}/${url}`)
  ).data;

  return result;
};

export const propertyDetailsService = async (
  propertyId: string,
  data: {
    populatePropertyUnits?: boolean;
    populateUserOwners?: boolean;
    populateJobs?: boolean;
  }
) => {
  const url = generateDynamicPath(constants.PropertyApiRoutes.details, {
    propertyId,
  });

  const result: interfaces.IPropertyDetailsResData = (
    await makeGetRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data.record;
};

export const propertyEditService = async (
  propertyId: string,
  data: interfaces.IPropertyEditReqData
) => {
  const url = generateDynamicPath(constants.PropertyApiRoutes.details, {
    propertyId,
  });

  const result: interfaces.IPropertyEditResData = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};
