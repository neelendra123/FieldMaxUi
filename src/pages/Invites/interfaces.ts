import { deviceType } from '../../config';
import { ICommonResponse } from '../../interfaces';

export enum IInviteKind {
  jobInvite = 'JobInvite',
  userInvite = 'UserInvite',
  userOwnerInvite = 'UserOwnerInvite',
}

export enum IInviteStatusKind {
  notRequired = 'NotRequired',
  notSent = 'NotSent',
  pending = 'Pending',
  accepted = 'Accepted',
  rejected = 'Rejected',
  //This is Not at server
  savePending = 'Save Pending',
}

export interface IInvite {
  token?: string;
  status: IInviteStatusKind;

  createdAt?: string;
  updatedAt?: string;
}

//  Invite
export interface InviteNewUserReqData {
  token: string;

  firstName: string;
  lastName: string;
  password: string;

  companyName: string;

  deviceType: typeof deviceType;
}

export interface IJobInviteJWTDecodedData {
  kind: IInviteKind.jobInvite;

  userId: string;
  primaryUserId: string;
  creatorId: string;

  invitedPrimaryUserId: string;

  email: string;

  jobId: string;
}
export interface IUserInviteJWTDecodedData {
  kind: IInviteKind.userInvite;

  userId: string;
  primaryUserId: string;
  creatorId: string;

  invitedPrimaryUserId: string;

  email: string;
}
export interface IUserOwnerInviteJWTDecodedData {
  kind: IInviteKind.userOwnerInvite;

  userId: string;
  primaryUserId: string;
  creatorId: string;

  invitedPrimaryUserId: string;

  email: string;
}

export type InviteJWTDecodedData =
  | IJobInviteJWTDecodedData
  | IUserInviteJWTDecodedData
  | IUserOwnerInviteJWTDecodedData;

export interface IInviteUserData {
  email: string;
  firstName: string;
  lastName: string;
  newUser: boolean;
  id: string;
  userOwnerId?: string;
  primaryUserId: string;
  account:{name:string};
}

export interface IInviteJobData {
  title: string;
  primaryUserId: string;
  address: {
    formatted: string;
  };
  users: {
    status: IInviteStatusKind;
    token: string;
    createdAt: string;
    updatedAt: string;
  }[];
  id: string;
}

export interface InviteDecodeJWTResData {
  tokenError?: string;
  jwtData: InviteJWTDecodedData;
  user: IInviteUserData;
  job?: IInviteJobData;
}

export interface IParsedInvite {
  token: string;
  data: InviteDecodeJWTResData;
}

export interface IInviteDecodeJWTRes extends ICommonResponse {
  data: InviteDecodeJWTResData;
}

export interface InviteUpdateRes extends ICommonResponse {
  data: {
    message: string;
  };
}

export interface IInviteStatusUpdateService {
  token: string;
  status: IInviteStatusKind.accepted | IInviteStatusKind.rejected;
}
