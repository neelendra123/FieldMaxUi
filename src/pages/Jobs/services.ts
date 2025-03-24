import { ICommonResponse } from '../../interfaces';
import { apiURLV1 } from '../../config';

import {
  makeDeleteRequest,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
} from '../../utils/axios';
import { generateDynamicPath } from '../../utils/common';

import { IJobSubModuleTypes } from '../Orgs/interfaces';

import { IUserListAllResData, IUserListAllRes } from '../Users/interfaces';

import { IMediaKind } from '../Medias/interfaces';

import {
  IJobDetailTimelineListReqData,
  IListJobDetailTimelineResData,
} from '../Timelines/interfaces';

import * as interfaces from './interfaces';
import * as constants from './constants';


export const uploadFile = async (data: any) => {
  const result = (
    await makePostRequest(`${apiURLV1}/${'medias/uploadphotos'}`, data)
  ).data;
  return result.data.data;
}


export const uploadDocument = async (data: any) => {
  const result = (
    await makePostRequest(`${apiURLV1}/${'medias/uploadphotos'}`, data)
  ).data;
  return result.data.data;
}


export const jobCreateService = async (data: interfaces.IJobAddReqData) => {
  const result: interfaces.IAddEditJobResData = (
    await makePostRequest(constants.JobApiRoutes.base, data)
  ).data;

  return result;
};

export const jobsListService = async (data: interfaces.IJobsListReqData) => {
  const result: interfaces.IJobsListResData = (
    await makeGetRequest(constants.JobApiRoutes.base, data)
  ).data;

  return result.data;
};

export const jobDeleteService = async (jobId: string) => {
  const url = generateDynamicPath(constants.JobApiRoutes.details, {
    jobId,
  });

  const result: interfaces.IJobDetailResData = (
    await makeDeleteRequest(`${apiURLV1}/${url}`)
  ).data;

  return result;
};

// export const jobDetailService = async (
//   jobId: string,
//   params: any = {}
// ): Promise<interfaces.IJobPopulated> => {
//   const url = generateDynamicPath(constants.JobApiRoutes.details, {
//     jobId,
//   });

//   const result: interfaces.IJobDetailResData = (
//     await makeGetRequest(`${apiURLV1}/${url}`, params)
//   ).data;

//   return result.data.job;
// };
export const jobDetailService = async (
  jobId: string,
  params: any = {}
): Promise<any> => {
  const url = generateDynamicPath(constants.JobApiRoutes.details, {
    jobId,
  });

  const result: any = (
    await makeGetRequest(`${apiURLV1}/${url}`, params)
  ).data;

  return result.data.job;
};
//
//get work orders
export const jobWorkOrders = async (
  issueId: number
): Promise<any> => {
  const url = generateDynamicPath(constants.JobApiRoutes.workorders, {
    issueId,
  });

  const result = await makeGetRequest(`${apiURLV1}/${url}`);

  return result.data;
};

//
export const sendStripeRequest  = async (
  destinationId: string, // Assuming email is a string
  amount: string,
  currency: string,
  vendorbills: object,
  billdetails: object,
  primaryUserId: string,
): Promise<any> => {
  const url = "stripe/payment-sheet";
  console.log(url);

  const result = await makePostRequest(
    `${apiURLV1}/${url}`,
    { destinationId, amount, currency, vendorbills, billdetails, primaryUserId } // Pass email and type as an object in the request body
  );

  return result.data;
};
//
export const updateIssueStatus = async (
  issueId: number,
  status: string,
): Promise<any> => {
  const url = generateDynamicPath(constants.JobApiRoutes.updatestatusissue, {
    issueId,status
  });
  console.log(url);
  const result = await makePostRequest(`${apiURLV1}/${url}`);

  return result.data;
};
//
//  Job Edit
export const jobEditService = async (
  jobId: string,
  data: interfaces.IJobEditReqData
) => {
  const url = generateDynamicPath(constants.JobApiRoutes.details, {
    jobId,
  });

  const result: interfaces.IAddEditJobResData = (
    await makePostRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};

//  Job Member Invite
export const jobMemberInviteService = async (
  jobId: string,
  data: interfaces.IJobMemberInviteReqData
) => {
  const url = generateDynamicPath(constants.JobApiRoutes.memberInvite, {
    jobId,
  });

  const result: ICommonResponse = (
    await makePostRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};

//  Job Member Delete
export const jobMemberDeleteService = async (
  jobId: string,
  data: interfaces.IJobMemberDeleteReqData
) => {
  const url = generateDynamicPath(constants.JobApiRoutes.memberDelete, {
    jobId,
  });

  const result: ICommonResponse = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};

//  Job Member Edit
export const jobMemberEditService = async (
  jobId: string,
  data: interfaces.IJobMemberEditReqData
) => {
  const url = generateDynamicPath(constants.JobApiRoutes.memberEdit, {
    jobId,
  });

  const result: ICommonResponse = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};

//  Job Members Add
export const jobMembersAddService = async (
  jobId: string,
  data: interfaces.IJobMembersAddReqData
) => {
  const url = generateDynamicPath(constants.JobApiRoutes.membersAdd, {
    jobId,
  });

  const result: ICommonResponse = (
    await makePutRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result;
};

//  List Job Sub Module Members like: Videos, Photos, Documents
export const jobSubModuleMembersListService = async (
  jobId: string,
  {
    skipSubModuleCheck = false,
    subModuleKind,

    skipInviteCheck = false,
  }: {
    skipSubModuleCheck?: boolean;
    subModuleKind?:
      | IJobSubModuleTypes.mediaVideos
      | IJobSubModuleTypes.mediaPhotos
      | IJobSubModuleTypes.documents;

    skipInviteCheck?: boolean;
  }
): Promise<IUserListAllRes[]> => {
  const url = generateDynamicPath(constants.JobApiRoutes.members, {
    jobId,
  });

  let result: IUserListAllResData = (
    await makeGetRequest(`${apiURLV1}/${url}`, {
      skipSubModuleCheck,
      subModuleKind,
      skipInviteCheck,
    })
  ).data;

  return result.data.data;
};

export const jobMediaDeleteService = async (
  jobId: string,
  mediaIds: string[],
  kind: IMediaKind.JobPhoto | IMediaKind.JobVideo | IMediaKind.JobDoc
) => {
  const url = generateDynamicPath(constants.JobApiRoutes.jobMedias, {
    jobId,
  });

  let result: interfaces.IJobMediaDeleteResData = (
    await makeDeleteRequest(
      `${apiURLV1}/${url}?kind=${kind}&mediaIds[]=${mediaIds}`
    )
  ).data;

  return result;
};

//  Job Details Listing Timeline
export const jobDetailTimelineListService = async (
  jobId: string,
  data: IJobDetailTimelineListReqData
) => {
  const url = generateDynamicPath(constants.JobApiRoutes.timelines, {
    jobId,
  });

  const result: IListJobDetailTimelineResData = (
    await makePostRequest(`${apiURLV1}/${url}`, data)
  ).data;

  return result.data.list;
};

export const jobMediasListService = async (
  jobId: string,
  data: {
    kind: IMediaKind.JobPhoto | IMediaKind.JobDoc;
    userPopulate: boolean;
  }
) => {
  const path = generateDynamicPath(constants.JobApiRoutes.medias, {
    jobId,
  });

  const result: interfaces.IJobMediasListResData = (
    await makeGetRequest(`${apiURLV1}/${path}`, data)
  ).data;

  return result.data.list;
};
export const getBillsData = async (params: any = {}) => {
  const result = (
    await makeGetRequest(`${apiURLV1}/${'bills'}`, params)
  ).data;
  console.log(result)
  return result.data;
}

export const getBillsDetailsData = async (params: any = {}) => {
  const result = (
    await makePostRequest(`${apiURLV1}/${'jobs/billdetails'}/${params.billid}`, params)
  ).data;
  console.log(result)
  return result;
}

export const getVendorConnectAccountID = async (params: any = {}) => {
  const result = (
    await makeGetRequest(`${apiURLV1}/${'user/getStripeId/'}`, params)
  ).data;
  console.log(result)
  return result.data;
}