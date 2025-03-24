import { ICommonResponse } from '../../interfaces';

import { IJobPhoto, IJobVideo, IJobDoc } from '../Medias/interfaces';

import { IJobSubModuleTypes } from '../Orgs/interfaces';

import { IUserIdPopulated } from '../Users/interfaces';

import { IMediaLink } from '../Links/interfaces';

//////////////////////////
//  //  //  Timeline
//////////////////////////
export enum IInviteTimelineMetaDataEvent {
  InviteAccepted = 'InviteAccepted',
  InviteRejected = 'InviteRejected',
}

//////////////////////////
//  //  //  Media Timeline
//////////////////////////
export enum IMediaTimelineMetaDataEvent {
  VideoCreate = 'VideoCreate',
  VideoDelete = 'VideoDelete',
  VideoSubMediaInfoEdit = 'VideoSubMediaInfoEdit',
  VideoSubMediaPermEdit = 'VideoSubMediaPermEdit',
  VideoSubMediaLinkCreate = 'VideoSubMediaLinkCreate',

  PhotoCreate = 'PhotoCreate',
  PhotoDelete = 'PhotoDelete',
  PhotoSubMediaInfoEdit = 'PhotoSubMediaInfoEdit',
  PhotoSubMediaPermEdit = 'PhotoSubMediaPermEdit',
  PhotoSubMediaLinkCreate = 'PhotoSubMediaLinkCreate',

  DocCreate = 'DocCreate',
  DocDelete = 'DocDelete',
  DocSubMediaInfoEdit = 'DocSubMediaInfoEdit',
  DocSubMediaPermEdit = 'DocSubMediaPermEdit',
  DocSubMediaLinkCreate = 'DocSubMediaLinkCreate',
}

//////////////////////////
//  //  //  Conversation Timeline Events
//////////////////////////
export enum IConversationTimelineMetaDataEvent {
  ConversationCreate = 'ConversationCreate',
  NoteCreate = 'NoteCreate',
  CommentCreate = 'CommentCreate',
}

//////////////////////////
//  //  //  Job Timeline Events
//////////////////////////
export enum IJobTimelineMetaDataEvent {
  JobCreate = 'JobCreate',
  JobDetailEdit = 'JobDetailEdit',
  JobDelete = 'JobDelete',

  JobMemberInvite = 'JobMemberInvite',
  JobMemberDelete = 'JobMemberDelete',
  JobMemberEdit = 'JobMemberEdit',
  JobMemberAdd = 'JobMemberAdd',

  JobThumbnailEdit = 'JobThumbnailEdit',

  JobNoteCreate = 'JobNoteCreate',
}

export enum IBillsTimelineMetaDataEvent {
  VendorBills = 'VendorBills',
}
//  Events for Photo
export interface IPhotoCreateTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.PhotoCreate;

  user: IUserIdPopulated;

  media: IJobPhoto;

  reqData: object;

  createdAt: string;
}
export interface IPhotoDeleteTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.PhotoDelete;

  user: IUserIdPopulated;

  media: IJobPhoto;

  reqData: object;

  createdAt: string;
}
export interface IPhotoSubMediaInfoEditTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.PhotoSubMediaInfoEdit;

  user: IUserIdPopulated;

  media: IJobPhoto;

  reqData: object;

  createdAt: string;
}
export interface IPhotoSubMediaPermEditTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.PhotoSubMediaPermEdit;

  user: IUserIdPopulated;

  media: IJobPhoto;

  reqData: object;

  createdAt: string;
}
export interface IPhotoSubMediaLinkCreateTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.PhotoSubMediaLinkCreate;

  user: IUserIdPopulated;

  reqData: object;

  media: IJobPhoto;
  link: IMediaLink;

  createdAt: string;
}

//  Events for Video
export interface IVideoCreateTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.VideoCreate;

  user: IUserIdPopulated;

  media: IJobVideo;

  reqData: object;

  createdAt: string;
}
export interface IVideoDeleteTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.VideoDelete;

  user: IUserIdPopulated;

  media: IJobVideo;

  createdAt: string;
}
export interface IVideoSubMediaInfoEditTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.VideoSubMediaInfoEdit;

  user: IUserIdPopulated;

  reqData: object;

  media: IJobVideo;

  createdAt: string;
}
export interface IVideoSubMediaPermEditTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.VideoSubMediaPermEdit;

  user: IUserIdPopulated;

  reqData: object;

  media: IJobVideo;

  createdAt: string;
}
export interface IVideoSubMediaLinkCreateTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.VideoSubMediaLinkCreate;

  user: IUserIdPopulated;

  reqData: object;

  media: IJobVideo;
  link: IMediaLink;

  createdAt: string;
}

//  Events for Document
export interface IDocCreateTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.DocCreate;

  user: IUserIdPopulated;

  media: IJobDoc;

  reqData: object;

  createdAt: string;
}
export interface IDocDeleteTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.DocDelete;

  user: IUserIdPopulated;

  media: IJobDoc;

  createdAt: string;
}
export interface IDocSubMediaInfoEditTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.DocSubMediaInfoEdit;

  user: IUserIdPopulated;

  reqData: object;

  media: IJobDoc;

  createdAt: string;
}
export interface IDocSubMediaPermEditTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.DocSubMediaPermEdit;

  user: IUserIdPopulated;

  reqData: object;

  media: IJobDoc;

  createdAt: string;
}
export interface IDocSubMediaLinkCreateTimelineEvent {
  id: string;

  event: IMediaTimelineMetaDataEvent.DocSubMediaLinkCreate;

  user: IUserIdPopulated;

  reqData: object;

  media: IJobDoc;
  link: IMediaLink;

  createdAt: string;
}

//  Events For Comment
export interface ICommentCreateTimelineEvent {
  id: string;

  event: IConversationTimelineMetaDataEvent.CommentCreate;

  user: IUserIdPopulated;

  media: IJobPhoto | IJobVideo | IJobDoc;

  reqData: object;
  postData: object & {
    subMediaId: string;
    message: string;
  };

  createdAt: string;
}

//  Events For Conversation
export interface IConversationCreateTimelineEvent {
  id: string;

  event: IConversationTimelineMetaDataEvent.ConversationCreate;

  user: IUserIdPopulated;

  reqData: object;
  postData: object & {
    message: string;
  };

  createdAt: string;
}

//  Events For Notepad
export interface INoteCreateTimelineEvent {
  id: string;

  event: IConversationTimelineMetaDataEvent.NoteCreate;

  user: IUserIdPopulated;

  reqData: object;
  postData: object & {
    message: string;
  };

  createdAt: string;
}

export interface IBillsCreateTimelineEvent {
  id: string;

  event: IBillsTimelineMetaDataEvent.VendorBills;

  user: IUserIdPopulated;

  reqData: object;
  postData: object & {
    title: string;
  };

  createdAt: string;
}

//////////////////////////
//  //  //  Job Timeline
//////////////////////////
export interface IJobDetailTimelineListReqData {
  sortOrder: 'asc' | 'desc';

  startDt: string;
  endDt: string;

  itemFilters: {
    [IJobSubModuleTypes.mediaPhotos]: boolean;
    [IJobSubModuleTypes.mediaVideos]: boolean;
    [IJobSubModuleTypes.documents]: boolean;
    [IJobSubModuleTypes.conversations]: boolean;
    [IJobSubModuleTypes.comments]: boolean;
    [IJobSubModuleTypes.notes]: boolean;
  };
  userUpdateFilters: {
    permissions: boolean;
    invitation: boolean;
    termination: boolean;
  };
  userFilters: string[];
}

//  Job Events like: Create, Delete, Edit Info, Members Events
export interface IJobCreateTimelineEvent {
  id: string;

  event: IJobTimelineMetaDataEvent.JobCreate;
  user: IUserIdPopulated;

  createdAt: string;
}
export interface IJobDeleteTimelineEvent {
  id: string;

  event: IJobTimelineMetaDataEvent.JobDelete;
  user: IUserIdPopulated;

  createdAt: string;
}
export interface IJobDetailEditTimelineEvent {
  id: string;

  event: IJobTimelineMetaDataEvent.JobDetailEdit;
  user: IUserIdPopulated;

  preData: object;
  postData: object;

  createdAt: string;
}
export interface IJobMemberDeleteTimelineEvent {
  id: string;

  event: IJobTimelineMetaDataEvent.JobMemberDelete;
  user: IUserIdPopulated;

  member: IUserIdPopulated;

  createdAt: string;
}
export interface IJobMemberEditTimelineEvent {
  id: string;

  event: IJobTimelineMetaDataEvent.JobMemberEdit;
  user: IUserIdPopulated;

  member: IUserIdPopulated;

  preData: object;
  postData: object;

  createdAt: string;
}
export interface IJobMemberAddTimelineEvent {
  id: string;

  event: IJobTimelineMetaDataEvent.JobMemberAdd;
  user: IUserIdPopulated;

  member: IUserIdPopulated;

  reqData: object;
  postData: object;

  createdAt: string;
}

//  Job Events for Member Invite -> Send, Accept, Reject
export interface IJobMemberInviteTimelineEvent {
  id: string;

  event: IJobTimelineMetaDataEvent.JobMemberInvite;
  user: IUserIdPopulated;

  member: IUserIdPopulated;

  reqData: object;
  postData: object;

  createdAt: string;
}
export interface IJobMemberInviteAcceptTimelineEvent {
  id: string;

  event: IInviteTimelineMetaDataEvent.InviteAccepted;

  user: IUserIdPopulated;
  member: IUserIdPopulated;

  createdAt: string;
}
export interface IJobMemberInviteRejectTimelineEvent {
  id: string;

  event: IInviteTimelineMetaDataEvent.InviteRejected;

  user: IUserIdPopulated;
  member: IUserIdPopulated;

  createdAt: string;
}

export type IJobTimelineEvent =
  //  Job Events like: Create, Delete, Edit Info, Members Events
  | IJobCreateTimelineEvent
  | IJobDeleteTimelineEvent
  | IJobDetailEditTimelineEvent
  | IJobMemberDeleteTimelineEvent
  | IJobMemberEditTimelineEvent
  | IJobMemberAddTimelineEvent
  //  Job Events for Member Invite -> Send, Accept, Reject
  | IJobMemberInviteTimelineEvent
  | IJobMemberInviteAcceptTimelineEvent
  | IJobMemberInviteRejectTimelineEvent
  //  Events for Photo
  | IPhotoCreateTimelineEvent
  | IPhotoDeleteTimelineEvent
  | IPhotoSubMediaInfoEditTimelineEvent
  | IPhotoSubMediaPermEditTimelineEvent
  | IPhotoSubMediaLinkCreateTimelineEvent

  //  Events for Video
  | IVideoCreateTimelineEvent
  | IVideoDeleteTimelineEvent
  | IVideoSubMediaInfoEditTimelineEvent
  | IVideoSubMediaPermEditTimelineEvent
  | IVideoSubMediaLinkCreateTimelineEvent

  //  Events for Document
  | IDocCreateTimelineEvent
  | IDocDeleteTimelineEvent
  | IDocSubMediaInfoEditTimelineEvent
  | IDocSubMediaPermEditTimelineEvent
  | IDocSubMediaLinkCreateTimelineEvent

  //  Events For Comments
  | ICommentCreateTimelineEvent

  //  Events For Conversations
  | IConversationCreateTimelineEvent

  //  Events For Notes
  | INoteCreateTimelineEvent

  | IBillsCreateTimelineEvent;
  
  

export interface IListJobDetailTimelineResData extends ICommonResponse {
  data: {
    list: IJobTimelineEvent[];
  };
}
export interface IJobDetailsTabTimelineList {
  key: string;
  events: IJobTimelineEvent[];
}
