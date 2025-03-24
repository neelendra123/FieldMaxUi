import { ICommonSelectOption } from '../../interfaces';

import { IAuthUser } from '../Auth/interfaces';

import * as constants from './constants';
import * as interfaces from './interfaces';

export const formatUserName = (firstName: string, lastName: string = '') => {
  return `${firstName} ${lastName}`.trim();
};

export const formatUser = (user: interfaces.IUser) => {
  user.picURL = user.picURL || constants.DefaultUserPic;
  user.lastName = user.lastName || '';
  user.name = formatUserName(user.firstName, user.lastName);

  return user;
};

export const getUserTypes = (
  baseUserType: number = interfaces.IUserType.user,
  accountUserType: number = interfaces.IUserType.basic
) => {
  let isSuperAdmin = false;
  let isAdmin = false;
  let isOwner = false;

  if (baseUserType & interfaces.IUserType.superAdmin) {
    isSuperAdmin = true;
  }

  if (baseUserType & interfaces.IUserType.admin) {
    isAdmin = true;
  }

  if (accountUserType & interfaces.IUserType.owner) {
    isOwner = true;
  }

  return {
    isSuperAdmin,
    isAdmin,
    isOwner,
  };
};

export const generateUserIdPopulated = (user: IAuthUser) => {
  const userIdPopulated: interfaces.IUserIdPopulated = {
    id: user.id,
    name: formatUserName(user.firstName, user.lastName),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    picURL: user.picURL,
  };

  return userIdPopulated;
};

export const generateUserTypeFilterOptions = (currentUserType: number) => {
  const options: Record<interfaces.IUserType, ICommonSelectOption> = {
    [interfaces.IUserType.user]: {
      value: interfaces.IUserType.user,
      label: 'User',
    },
    // [IUserType.cOwner]: { value: IUserType.cOwner, label: 'Administrator' },
    // [IUserType.cResident]: { value: IUserType.cResident, label: 'Resident' },
    // [IUserType.cVendor]: { value: IUserType.cVendor, label: 'Vendor' },
  };

  if (
    currentUserType & interfaces.IUserType.superAdmin ||
    currentUserType & interfaces.IUserType.admin
  ) {
    options[interfaces.IUserType.admin] = {
      value: interfaces.IUserType.admin,
      label: 'Admin',
    };
  }

  return options;
};

export const getUserTypesArray = (userType: number) => {
  let accountUserTypes = [];
  if (userType & interfaces.IUserType.user) {
    accountUserTypes.push('User');
  }

  if (userType & interfaces.IUserType.owner) {
    accountUserTypes.push('Administrator');
  }
  return accountUserTypes;
};
