import {
  ICommonListingParams,
  ICommonResponse,
  ICommonAddress,
} from '../../interfaces';

import {
  IPhotoSubKinds,
  IMediaPopulatedTypes,
  IJobPhotoPopulated,
} from '../Medias/interfaces';

import { IJobSubModulePerms, IJobSubModuleTypes } from '../Orgs/interfaces';

import { IUserIdPopulated } from '../Users/interfaces';

import { IInvite } from '../Invites/interfaces';

export interface IUserJobDetail {
  mediaPhotosCount: number;
  mediaVideosCount: number;
  mediaDocsCount: number;

  contributionCount: number;
  contributionUpdatedAt?: string;
}

export interface IUserJobPerm {
  userId: string;
  primaryUserId: string;
  permissions: IJobSubModulePerms;

  createdAt: string;
  updatedAt: string;

  details: IUserJobDetail;

  invite: IInvite;
}

export interface IServiceIssuesPerm {
  ServiceManagerIssueID: number
}

export interface IJobDetails {
  mediaPhotosCount: number;
  mediaVideosCount: number;
  mediaDocsCount: number;
  conversationCount: number;
  notesCount: number;
  commentsCount: number;
  billCount: number;
  contributionUpdatedAt?: string;
}
export interface IBill {
  ServiceManagerIssueID: string;
  Comment: string;
  Amount: number;
  stripestatus: string;
  balanceamount: number;
  CreateDate: string;
  DueDate: string;
}
export interface IJob {
  id: string;

  primaryUserId: string;
  creatorId: string;

  propertyId?: string;
  propertyUnitId?: string;

  title: string;
  description?: string;

  startDt: string;
  endDt: string;

  address: ICommonAddress;

  users: IUserJobPerm[];

  medias: string[];

  details: IJobDetails;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;

  serviceIssues:IServiceIssuesPerm;
}

//  Jobs Interface Type with User Populated
export interface IJobUserPopulated extends Omit<IUserJobPerm, 'userId'> {
  userId: IUserIdPopulated;
}
export interface IJobBillPopulated extends Omit<IServiceIssuesPerm, 'ServiceManagerIssueID'> {
  ServiceManagerIssueID: IBill;
}
export interface IBillsListResData extends ICommonResponse {
  data: {
    count: number;
    list: IBill[];
  };
}
export interface IJobPopulated extends Omit<IJob, 'users' | 'medias'> {
  users: IJobUserPopulated[];

  medias: IMediaPopulatedTypes[]; // IJobPhoto[] | IJobVideo[] | IJobDoc[];

  //  These are added in the utils
  googlePath: string;

  currentUserJobPerm: IUserJobPerm;
  contributors: IJobUserPopulated[];
  mostContributorIndex: number;
  mostRecentContributorIndex: number;
}
export interface IBillPopulated extends Omit<IBill, 'bills'> {
  count : number,
  bills: IJobBillPopulated[];

}
export interface IBillResData extends ICommonResponse {
  data: {
    count: number;
    list: IBillPopulated[];
  };
}
//  Job Listing
export interface IJobsListReqData extends ICommonListingParams {}
export interface IBillsListReqData extends ICommonListingParams {}
export interface IJobsListResData extends ICommonResponse {
  data: {
    count: number;
    list: IJobPopulated[];
  };
}

export interface ICommonResData extends ICommonResponse {
  data: {
    job: IJob;
  };
}

//  Details Types
export type IJobDetailTabTypes =
  | 'pills-home'
  | 'pills-document'
| 'pills-bills'
  | 'pills-converstation'
  | 'pills-notpad'
  | 'pills-comments'
  | 'pills-timeline';

export interface IJobDetailResData extends ICommonResponse {
  data: {
    job: IJobPopulated;
  };
}

//////////////////////////
////////      Medias
//////////////////////////
export interface IJobPhotoDetailsHistoryState {
  job?: IJobPopulated;
  media?: IJobPhotoPopulated;
  selectedSubMediaId?: string;
  mediaSubKind?: IPhotoSubKinds;
}

export type IJobDetailsTabMediaGroupOptions = Record<
  string,
  {
    selected: boolean;
    sort: number;
  }
>;
export interface IJobDetailsTabMediaList {
  key: string;
  value: string;
  selected: boolean;
  sort: number; // 1 | -1
  medias: IMediaPopulatedTypes[];
}
export interface IBillsList {
  ID: number;
  Comment : string;
  DueDate : string;
}
//  Same For Media & Doc Apis
export interface IJobMediasListResData extends ICommonResponse {
  data: {
    list: IMediaPopulatedTypes[];
  };
}

export interface IJobMediaDeleteResData extends ICommonResponse {
  data: {};
}

//    //      //      //    Add or Edit
export interface IAddEditJobResData extends ICommonResponse {
  data: {
    job: IJob;
  };
}

export interface IJobAddPaths {
  map: string;
  details: string;
  addMembers: string;
  editMember: string;
  inviteMember: string;
}

export interface IAddJobUser {
  uid: string;

  id?: string;

  skip: boolean;
  selected: boolean;
  isLocal?: boolean;
  // isLocal: boolean;

  name: string;

  email: string;
  picURL?: string;
  permissions: IJobSubModulePerms;

  invite: IInvite;
}

export interface IAddEditMembersSortFilter {
  name: 1 | -1;
  email: 1 | -1;
}

export interface IAddEditJobUserReqData {
  name: string;
  email: string;
  permissions: IJobSubModulePerms;
}

export interface IAddEditJobReqData {
  title: string;
  description?: string;

  startDt: string;
  endDt: string;

  address: ICommonAddress;

  users: IAddEditJobUserReqData[];
}

export interface IJobAddReqData {
  propertyId?: string;
  propertyUnitId?: string;

  title: string;
  description?: string;

  startDt: string;
  endDt: string;

  address: ICommonAddress;

  users: IAddEditJobUserReqData[];
}

export interface IJobEditReqData {
  propertyId?: string;
  propertyUnitId?: string;

  title: string;

  startDt: string;
  endDt: string;

  address: ICommonAddress;
}

export interface IJobEditInfoPaths {
  map: string;
  details: string;
}

export interface IEditJobUser {
  id: string;

  skip: boolean;
  selected: boolean;

  name: string;

  email: string;
  picURL?: string;
  permissions: IJobSubModulePerms;

  invite: IInvite;
}

export interface IJobEditMembersPaths {
  base: string;
  addMembers: string;
  editMember: string;
  inviteMember: string;
}

export interface IJobMemberInviteReqData {
  name: string;
  email: string;
  permissions: IJobSubModulePerms;
}

export interface IJobMemberDeleteReqData {
  userId: string;
}

export interface IJobMemberEditReqData {
  userId: string;
  permissions: IJobSubModulePerms;
}

export interface IJobMembersAddReqData {
  users: IJobMemberEditReqData[];
}

//  Time Line

export type IJobDetailTimelineItemFilterTypes =
  | IJobSubModuleTypes.base
  | IJobSubModuleTypes.mediaPhotos
  | IJobSubModuleTypes.mediaVideos
  | IJobSubModuleTypes.documents
  | IJobSubModuleTypes.conversations
  | IJobSubModuleTypes.comments
  | IJobSubModuleTypes.notes;

export type IJobDetailTimelineItemFilters = Record<
  IJobDetailTimelineItemFilterTypes,
  boolean
>;

export type IJobDetailTimelineUserUpdateFilterTypes =
  | IJobSubModuleTypes.base
  | 'permissions'
  | 'invitation'
  | 'termination';

export type IJobDetailTimelineUserUpdateFilters = Record<
  IJobDetailTimelineUserUpdateFilterTypes,
  boolean
>;

export interface IPropertyJobPopulated {
  id: string;
  title: string;
  createdAt: string;
  address: ICommonAddress;
}
