import { ICommonResponse } from '../../interfaces';
import { apiURLV1 } from '../../config';

import {
  makeGetRequest,
  makePostRequest,
  makePutRequest,
} from '../../utils/axios';
import { generateDynamicPath } from '../../utils/common';

import { JobApiRoutes } from '../Jobs/constants';

import * as interfaces from './interfaces';
import * as constants from './constants';
import * as utils from './utils';

export const mediasPreSignedURLService = async ({
  jobId,
  data,
}: {
  jobId: string | undefined;
  data:
    | interfaces.IPhotoPreSignedURLReqData
    | interfaces.IDocsPreSignedURLReqData
    | interfaces.IVideosPreSignedURLReqData;
}) => {
  let url: string = '';

  if (jobId) {
    url = generateDynamicPath(constants.MediaApiRoutes.jobMediaPreSignedURLs, {
      jobId,
    });
  }

  let result: ICommonResponse = (
    await makePostRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data.data;
};

//  Job Medias Get
export const mediaDetailsService = async ({
  jobId,
  mediaId,
  params = {},
}: {
  jobId?: string;
  mediaId: string;
  params?: {
    kind?: interfaces.IMediaKind;
    subMediaId?: string;
  };
}) => {
  let url: string = '';

  if (jobId) {
    url = generateDynamicPath(JobApiRoutes.jobMediaDetails, {
      jobId,
      mediaId,
    });
  } else {
    //TODO:
  }

  const result: interfaces.IMediaDetailResData = (
    await makeGetRequest(`${apiURLV1}/${url}`, params)
  ).data;

  return result.data.media;
};

export const jobVideosAddService = async (
  jobId: string,
  medias: interfaces.IVideoAddMedia[]
) => {
  const data: interfaces.IJobVideosAddReqData = {
    kind: interfaces.IMediaKind.JobVideo,

    medias: [],
  };

  medias.forEach((media) => {
    data.medias.push({
      name: media.name,
      tags: media.tags,
      subMedias: [
        {
          name: media.medias[0].name,
          tags: media.medias[0].tags,
          media: media.medias[0].mediaPath,
          thumbnail: media.medias[0].thumbnailPath,
          users: utils.parseSubMediaUsersPermsForReq(media.medias[0].users),
        },
      ],
    });
  });

  const url = generateDynamicPath(constants.MediaApiRoutes.jobMedias, {
    jobId,
  });

  let result: interfaces.IJobVideosAddResData = (
    await makePostRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data;
};

export const jobDocsAddService = async (
  jobId: string,
  medias: interfaces.IDocAddMedia[]
) => {
  const data: interfaces.IJobDocsAddReqData = {
    kind: interfaces.IMediaKind.JobDoc,

    medias: [],
  };

  medias.forEach((media) => {
    data.medias.push({
      name: media.name,
      tags: media.tags,
      subMedias: [
        {
          name: media.medias[0].name,
          tags: media.medias[0].tags,
          media: media.medias[0].mediaPath,
          users: utils.parseSubMediaUsersPermsForReq(media.medias[0].users),
        },
      ],
    });
  });

  const url = generateDynamicPath(constants.MediaApiRoutes.jobMedias, {
    jobId,
  });

  let result: interfaces.IJobDocsAddResData = (
    await makePostRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data;
};

export const jobPhotosAddService = async (
  jobId: string,
  medias: interfaces.IPhotoAddMedia[]
) => {
  const data: interfaces.IJobPhotosAddReqData = {
    kind: interfaces.IMediaKind.JobPhoto,

    medias: [],
  };

  medias.forEach((media) => {
    data.medias.push({
      name: media.name,
      tags: media.tags,
      subKind: media.subKind,
      subMedias: media.medias.map((subMedia) => {
        return {
          name: subMedia.name,
          tags: subMedia.tags,
          media: subMedia.mediaPath,
          subKind: subMedia.subKind,
          users: utils.parseSubMediaUsersPermsForReq(subMedia.users),
        };
      }),
    });
  });

  const url = generateDynamicPath(constants.MediaApiRoutes.jobMedias, {
    jobId,
  });

  let result: interfaces.IJobPhotosAddResData = (
    await makePostRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data;
};

export const videoSubMediaInfoEditService = async (
  {
    subMediaId,
    mediaKind,
  }: {
    subMediaId: string;
    mediaKind: interfaces.IMediaKind.JobVideo | interfaces.IMediaKind.Video;
  },
  data: {
    name: string;
    tags: string[];
    media: string;
    thumbnail: string;
  }
) => {
  let url = generateDynamicPath(constants.MediaApiRoutes.mediaInfoEdit, {
    mediaKind,
    subMediaId,
  });

  let result: interfaces.IJobVideosAddResData = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data;
};

export const photoSubMediaInfoEditService = async (
  {
    subMediaId,
    mediaKind,
  }: {
    subMediaId: string;
    mediaKind: interfaces.IMediaKind.JobPhoto | interfaces.IMediaKind.Photo;
  },
  data: {
    name: string;
    tags: string[];
    media: string;
  }
) => {
  let url = generateDynamicPath(constants.MediaApiRoutes.mediaInfoEdit, {
    mediaKind,
    subMediaId,
  });

  let result: interfaces.IJobPhotosAddResData = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data;
};

export const docSubMediaInfoEditService = async (
  {
    subMediaId,
    mediaKind,
  }: {
    subMediaId: string;
    mediaKind: interfaces.IMediaKind.JobDoc | interfaces.IMediaKind.Doc;
  },
  data: {
    name: string;
    tags: string[];
    media: string;
  }
) => {
  let url = generateDynamicPath(constants.MediaApiRoutes.mediaInfoEdit, {
    mediaKind,
    subMediaId,
  });

  let result: interfaces.IJobDocsAddResData = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data;
};

export const mediaSubMediaPermEditService = async (
  {
    subMediaId,
    mediaKind,
  }: {
    subMediaId: string;
    mediaKind: interfaces.IMediaKind;
  },
  data: {
    users: interfaces.ISubMediaUser[];
  }
) => {
  let url = generateDynamicPath(constants.MediaApiRoutes.mediaPermEdit, {
    mediaKind,
    subMediaId,
  });

  let result: interfaces.IJobVideosAddResData = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};

export const jobMediasListAllService = async (
  jobId: string,
  data: {
    kinds?: interfaces.IMediaKind[];
  }
) => {
  const url = generateDynamicPath(constants.MediaApiRoutes.jobMediasAll, {
    jobId,
  });

  const result: interfaces.IJobMediasListAllResData = (
    await makeGetRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data.list;
};
