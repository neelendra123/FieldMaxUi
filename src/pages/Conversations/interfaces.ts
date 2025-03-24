import { ICommonResponse } from '../../interfaces';

import { IMediaPopulatedTypes } from '../Medias/interfaces';

import { IUserIdPopulated } from '../Users/interfaces';

export enum IConversationKinds {
  comments = 'Comment',
  conversation = 'Conversation',
  note = 'Note',
}

export interface IConversation {
  id: string;
  primaryUserId: string;

  kind: IConversationKinds;

  creatorId: string;

  jobId?: string;
  mediaId?: string;
  subMediaId?: string;

  message: string;

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

export type IConvPopulatedTypes =
  | INotesPopulated
  | IConversationsPopulated
  | ICommentsPopulated;

//////////////////////////
////////      Notes
//////////////////////////
export interface INotesPopulated
  extends Omit<IConversation, 'creatorId' | 'kind'> {
  kind: IConversationKinds.note;

  creatorId: IUserIdPopulated;
}

export interface INotesListReqData {
  kind: IConversationKinds.note;
  jobId: string;
  search?: string;
  creatorPopulate: boolean;
}
export interface NotesListResData extends ICommonResponse {
  data: {
    list: INotesPopulated[];
  };
}

//////////////////////////
////////      Conversations
//////////////////////////
export interface IConversationsPopulated
  extends Omit<IConversation, 'creatorId'> {
  creatorId: IUserIdPopulated;
}

export interface IConversationsListReqData {
  kind: IConversationKinds;
  jobId: string;
  search?: string;
  creatorPopulate: boolean;
}
export interface IConversationsListResData extends ICommonResponse {
  data: {
    list: IConversationsPopulated[];
  };
}

export interface IConversationAddReqData {
  kind: IConversationKinds;
  jobId: string;
  mediaId?: string;
  subMediaId?: string;
  message: string;
}
export interface IConversationAddResData extends ICommonResponse {
  data: {
    conversation: IConversation;
  };
}

//////////////////////////
////////      Comments
//////////////////////////
export interface ICommentsPopulated extends Omit<IConversation, 'creatorId'> {
  kind: IConversationKinds.comments;

  creatorId: IUserIdPopulated;
}

export interface IMediaCommentsListReqData {
  kind: IConversationKinds.comments;
  jobId: string;
  mediaId: string;
  subMediaId: string;

  creatorPopulate: boolean;
  mediaPopulate: boolean;
}
export interface IMediaCommentsListResData extends ICommonResponse {
  data: {
    list: ICommentsPopulated[];
  };
}

//////////////////////////
//  Job Module
//////////////////////////
export interface IJobCommentsPopulated
  extends Omit<ICommentsPopulated, 'mediaId'> {
  mediaId: IMediaPopulatedTypes;
}

export interface IJobCommentsListReqData {
  jobId: string;
  search?: string;
}
export interface IJobCommentsListResData extends ICommonResponse {
  data: {
    list: IJobCommentsPopulated[];
  };
}
