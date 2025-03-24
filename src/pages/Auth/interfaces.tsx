import { deviceType } from '../../config';
import {
  ICommonAddress,
  ICommonResponse,
  IProductKind,
} from '../../interfaces';

import { IAccount } from '../Accounts/interfaces';

import { IOrgAccess } from '../Orgs/interfaces';

import { IUser } from '../Users/interfaces';

//  Login
export interface ILoginReqData {
  email: string;
  password: string;
  deviceType: typeof deviceType;
}

export interface IAuthPrimaryUserPopulate {
  account: {
    name?: string;
    address?: ICommonAddress;
    phone?: string;
    primaryEmail?: string;
    logo?: string;
    logoURL: string;
  };
  id: string;
}

export interface IAuthUserAccount extends Omit<IOrgAccess, 'primaryUserId'> {
  primaryUserId: IAuthPrimaryUserPopulate;
}

export interface IAuthUser extends Omit<IUser, 'accounts'> {
  accounts: IAuthUserAccount[];

  //  For Theme
  account?: IAccount;

  integrations?: {
    RentManager: {
      isActive: boolean;
    };
  };

  stripeid?: string;
}

export interface IAuthResData extends ICommonResponse {
  data: {
    auth: {
      token: string;
      // expiry: number;
    };
    user: IAuthUser;
  };
}

//  Password Update
export interface IPasswordForgotReqData {
  email: string;
}

export interface IPasswordForgotResData extends ICommonResponse {
  data: {};
}

//  Password Reset
export interface IPasswordResetReqData {
  newPassword: string;
  token: string;
}

export interface IPasswordResetResData extends ICommonResponse {
  data: {};
}

//  Register
export interface IRegisterReqData {
  productKind: IProductKind;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  deviceType: string;
  companyName: string;
}

//  Password Reset
export interface IResetPasswordJWTDecodedData {
  userId: string;

  firstName: string;
  lastName: string;
  email: string;
}

export interface IResetPasswordJWTResData extends ICommonResponse {
  data: {
    jwtData: IResetPasswordJWTDecodedData;
  };
}
