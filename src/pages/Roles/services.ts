import { makeGetRequest, makePostRequest } from '../../utils/axios';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const rolesCreateService = async (data: interfaces.IRoleAddFormData) => {
  const result: interfaces.ICommonRoleResData = (
    await makePostRequest(constants.RoleApiRoutes.base, data)
  ).data;

  return result;
};

export const rolesListService = async (data: { search?: string }) => {
  const result: interfaces.IRolesListResData = (
    await makeGetRequest(constants.RoleApiRoutes.base, data)
  ).data;

  return result.data.list;
};
