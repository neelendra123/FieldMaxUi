import { generateDynamicPath } from '../../utils/common';
import { makeGetRequest, makePostRequest } from '../../utils/axios';

import { apiURLV1 } from '../../config';

import * as interfaces from './interfaces';
import * as constants from './constants';

export const conversationAddService = async (
  data: interfaces.IConversationAddReqData
) => {
  const result: interfaces.IConversationAddResData = (
    await makePostRequest(constants.ConversationsApiRoutes.base, data)
  ).data;

  return result;
};

export const conversationsListService = async (
  jobId: string,
  search?: string,
  creatorPopulate: boolean = false
) => {
  const data: interfaces.IConversationsListReqData = {
    kind: interfaces.IConversationKinds.conversation,
    jobId,
    search,
    creatorPopulate,
  };

  const result: interfaces.IConversationsListResData = (
    await makeGetRequest(constants.ConversationsApiRoutes.base, data)
  ).data;

  return result.data.list;
};

export const notesListService = async (
  jobId: string,
  search?: string,
  creatorPopulate: boolean = false
) => {
  const data: interfaces.INotesListReqData = {
    kind: interfaces.IConversationKinds.note,
    jobId,
    search,
    creatorPopulate,
  };

  const result: interfaces.NotesListResData = (
    await makeGetRequest(constants.ConversationsApiRoutes.base, data)
  ).data;

  return result.data.list;
};

export const mediaCommentsListService = async (
  jobId: string,
  mediaId: string,
  subMediaId: string,
  creatorPopulate: boolean = false,
  mediaPopulate: boolean = false
) => {
  const data: interfaces.IMediaCommentsListReqData = {
    kind: interfaces.IConversationKinds.comments,
    jobId,
    mediaId,
    subMediaId,
    creatorPopulate,
    mediaPopulate,
  };

  const result: interfaces.IMediaCommentsListResData = (
    await makeGetRequest(constants.ConversationsApiRoutes.base, data)
  ).data;

  return result.data.list;
};

export const jobCommentsListService = async (
  jobId: string,
  search?: string
) => {
  const data: interfaces.IJobCommentsListReqData = {
    jobId,
    search,
  };

  const path = generateDynamicPath(
    constants.ConversationsApiRoutes.jobComments,
    {
      jobId,
    }
  );

  const result: interfaces.IJobCommentsListResData = (
    await makeGetRequest(`${apiURLV1}/${path}`, data)
  ).data;

  return result.data.list;
};
