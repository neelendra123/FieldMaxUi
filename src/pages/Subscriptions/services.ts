import { apiURLV1 } from '../../config';

import { makeGetRequest } from '../../utils/axios';
import { generateDynamicPath } from '../../utils/common';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const plansListService = async (productKind: number) => {
  const url = generateDynamicPath(constants.SubscriptionRoutes.planslisting, {
    productKind: `${productKind}`,
  });

  const result: interfaces.IPlansListingResData = (
    await makeGetRequest(`${apiURLV1}/${url}`)
  ).data;

  return result.data;
};
