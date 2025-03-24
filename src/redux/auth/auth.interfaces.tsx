import { IProductDetails } from '../../interfaces';

import { IAuthUser } from '../../pages/Auth/interfaces';

import { IParsedOrgSubModulePerms } from '../../pages/Orgs/interfaces';

export enum IActionTypes {
  AUTH_UPDATE = 'AUTH_UPDATE',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  LOGOUT = 'LOGOUT',
  ACCOUNT_CHANGE = 'ACCOUNT_CHANGE',
}

//  Auth Update
export interface IAuthUpdatePayload {
  user: IAuthUser;
  auth: {
    token: string;
    // expiry: number;
  };
}
export interface IAuthUpdateAction {
  type: IActionTypes.AUTH_UPDATE;
  payload: IAuthUpdatePayload;
}

//  Profile Update
export interface IProfileUpdatePayload {
  user: IAuthUser;
}
export interface IProfileUpdateAction {
  type: IActionTypes.PROFILE_UPDATE;
  payload: IProfileUpdatePayload;
}

//  Logout
export interface ILogoutAction {
  type: IActionTypes.LOGOUT;
}

//  Account Change
export interface IAccountChangePayload {
  accountIndex: number;
}
export interface IAccountChangeAction {
  type: IActionTypes.ACCOUNT_CHANGE;
  payload: IAccountChangePayload;
}

export type IAuthActions =
  | IAuthUpdateAction
  | IProfileUpdateAction
  | ILogoutAction
  | IAccountChangeAction;

export interface IDefaultState {
  auth: {
    token?: string | null;
    // expiry?: string | null;
  };
  authUser: IAuthUser;
  //  This one stores all the parsed permissions for all accounts
  accountsPermissions: IParsedOrgSubModulePerms[];
  //  This stores user type for current active account
  accountsUserTypes: {
    isSuperAdmin: boolean;
    isAdmin: boolean;
    isOwner: boolean;
  }[];

  accountIndex: number;

  product: IProductDetails;
}
