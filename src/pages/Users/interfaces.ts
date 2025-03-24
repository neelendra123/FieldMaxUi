import {
  ICommonListingParams,
  ICommonResponse,
  IModuleKind,
} from '../../interfaces';
import { IOrgAccess, IOrgPerms } from '../Orgs/interfaces';

export enum IUserType {
  basic = 1 << 0,

  superAdmin = 1 << 1,
  admin = 1 << 2,

  owner = 1 << 3,
  user = 1 << 4,

  cContact = 1 << 5,
  // cOwner = 1 << 6,
  cResident = 1 << 7,
  cVendor = 1 << 8,
}

export enum IUserModuleKind {
  cContact = 'cContact',
  // cOwner = 'cOwner',
  cResident = 'cResident',
  cVendor = 'cVendor',
}

export interface ITheme {
  primary: string;
  primaryLight: string;
}

export interface IUser {
  id: string;

  firstName: string;
  lastName?: string;
  email: string;
  pic?: string;
  picURL: string;
  primaryUserId: string;

  name?: string;

  theme: ITheme;

  accounts: IOrgAccess[];

  userType: number;
  serviceType: number;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

//  All Listings
export interface IUserListAllParams {
  moduleKind: IModuleKind;
}
export interface IUserListAllRes {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  pic?: string;
  picURL?: string;
  accounts: IOrgAccess[];
  userType: number;
}
export interface IUserListAllResData extends ICommonResponse {
  data: {
    data: IUserListAllRes[];
  };
}

export interface IEmailUniqueResData extends ICommonResponse {
  data: {
    result: boolean;
  };
}

export interface IUserIdPopulated {
  firstName: string;
  lastName?: string;
  name: string;
  email: string;
  id: string;
  // pic?: string;
  picURL?: string;
}

///     User Add
export interface IUserAddReqData {
  firstName: string;
  lastName?: string;
  email: string;
  permissions: IOrgPerms;
  sendEmail?: boolean;
  pic?: string;
}

export interface IUserAddResData extends ICommonResponse {
  data: {
    data: IUser;
  };
}

//  Users Listing
export interface IUsersListReqData extends ICommonListingParams { }

export interface IUsersListResData extends ICommonResponse {
  data: {
    count: number;
    list: IUser[];
  };
}

export interface IUserDeleteResData extends ICommonResponse {
  data: {};
}

export interface IUserGetResData extends ICommonResponse {
  data: {
    user: IUser;
  };
}

export interface IUserEditReqData {
  permissions: IOrgPerms;
}
export interface IUserEditResData extends ICommonResponse {
  data: {
    user: IUser;
  };
}
