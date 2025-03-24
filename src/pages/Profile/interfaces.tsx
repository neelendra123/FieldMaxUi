import { deviceType } from '../../config';
import { ICommonResponse } from '../../interfaces';

import { IAuthUser } from '../Auth/interfaces';

import { IUser } from '../Users/interfaces';

export interface IProfileGetResData extends ICommonResponse {
  data: {
    user: IAuthUser;
  };
}

//  Password Update
export interface IPasswordUpdateReqData {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
  deviceType: typeof deviceType;
}

export interface IPasswordUpdateResData extends ICommonResponse {
  data: {
    user: IUser;
  };
}

//  Profile Update
export interface IProfileUpdateReqData {
  firstName: string;
  lastName: string;
  pic?: string;
}

export interface IProfileUpdateResData extends ICommonResponse {
  data: {
    user: IAuthUser;
  };
}
