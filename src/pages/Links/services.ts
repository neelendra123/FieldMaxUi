import { apiURLV1 } from '../../config';

import { makeGetRequest, makePostRequest } from '../../utils/axios';
import { generateDynamicPath } from '../../utils/common';

import { IMediaTypes } from '../Medias/interfaces';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const mediaLinkDetailsService = async (token: string) => {
  const url = generateDynamicPath(constants.LinkApiRoutes.mediaLinkDetails, {
    token,
  });

  let result: interfaces.IMediaLinkDetailsResData = (
    await makeGetRequest(`${apiURLV1}/${url}`)
  ).data;

  return result.data.data;
};

export const mediaLinkAddService = async (
  mediaKind: IMediaTypes,
  subMediaId: string,
  data: interfaces.IMediaLinkAddReqData
) => {
  const url = generateDynamicPath(constants.LinkApiRoutes.mediaLinkAdd, {
    mediaKind,
    subMediaId,
  });

  let result: interfaces.IMediaLinkAddResData = (
    await makePostRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};
