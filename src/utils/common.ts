import { generatePath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import objectId from 'bson-objectid';

import {
  IProductKind,
  IACLCheckParams,
  IProductDetails,
  IStatusFilterOptions,
  ICommonPermTypes,
} from '../interfaces';
import { baseURL, isProduction } from '../config';
import { Colors, CommonPerms, StatusFilterValues } from '../constants';

import { IUserType } from '../pages/Users/interfaces';
import { DefaultUser } from '../pages/Auth/constants';
import { IAuthUser, IAuthUserAccount } from '../pages/Auth/interfaces';
import { IOrgPerms } from '../pages/Orgs/interfaces';

import { infoToast, clearAllToast } from './toast';

export const generateDynamicPath = (
  path: string,
  options: Record<string, any>
) => generatePath(path, options);

export const capitalizeFirstLetter = (value?: string): string => {
  if (!value) {
    return '';
  }

  return value[0].toUpperCase() + value.slice(1);
};

export const getAuthToken = () => {
  // const authExpiry = getAuthExpiry();

  // if (!authExpiry) {
  //   localStorage.clear();

  //   return null;
  // }

  return localStorage.getItem('authToken');
};
export const getAuthExpiry = () => {
  const authExpiry = localStorage.getItem('authExpiry');

  const now = new Date();

  if (!authExpiry) {
    return null;
  }

  if (now.getTime() > parseInt(authExpiry)) {
    // If the item is expired, return null
    return null;
  }

  return authExpiry;
};

export const getAuthUser = (): IAuthUser => {
  let user = localStorage.getItem('user') || JSON.stringify(DefaultUser);

  return JSON.parse(user);
};

export const getDefaultAccount = (): IAuthUserAccount => {
  const user = JSON.parse(
    localStorage.getItem('user') || JSON.stringify(DefaultUser)
  );
  const accountIndex = parseInt(localStorage.getItem('accountIndex') ?? '0');

  return user.accounts[accountIndex];
};

export const toLocaleDateString = (
  value: any = Date.now(),
  format = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
  }
) => {
  return new Date(value).toLocaleDateString(format, options);
};

export const toLocaleTimeString = (
  value: any = Date.now(),
  format = 'en-US'
) => {
  return new Date(value).toLocaleTimeString(format);
};

export const toLocaleDTString = (
  value: any = Date.now(),
  format = 'en-US',
  dateOptions: Intl.DateTimeFormatOptions = {
    dateStyle: 'long',
  }
) => {
  let formatted = `${new Date(value).toLocaleDateString(
    format,
    dateOptions
  )}, ${new Date(value).toLocaleTimeString(format)}`;

  return formatted;
};

export const abortController = new AbortController();

export const abortSignal = abortController.signal;

export const allowAccessCheck = (
  {
    moduleKind = null,

    subModuleKind = 'base',

    requiredPermission = -1,
    requiredUserType = -1,
  }: IACLCheckParams,
  user: {
    mainUserType: number;
    orgUserType: number;
    permissions: IOrgPerms;
  }
) => {
  // Super Admin, Admin Check of main then true
  if (
    user.mainUserType & IUserType.superAdmin ||
    user.mainUserType & IUserType.admin
  ) {
    return true;
  }

  if (!moduleKind) {
    return true;
  }

  //  User Type Check, if a specific user type can only access this resource
  if (requiredUserType >= 0) {
    if (!(user.orgUserType & requiredUserType)) {
      return false;
    }
  }

  //  If is owner of account or permission check is not required
  if (requiredPermission === -1 || user.mainUserType & IUserType.owner) {
    return true;
  }

  if (!user.permissions?.[moduleKind]) {
    return false;
  }

  //  Current Sub Module Permission Check
  //@ts-ignore
  const subModulePermission = user.permissions[moduleKind][subModuleKind];

  //  Sub Module Permission Check
  if (!(requiredPermission & subModulePermission)) {
    return false;
  }

  return true;
};

export const getProductDetails = (
  productKind: number = IProductKind.camMax
): IProductDetails => {
  //TODO Right Now defaults to CamMax360, later on will depend on userProducts
  let name = 'FieldMax';

  let logoURL = `${baseURL}assets/images/logofieldmax.png`;
  //let logoURL = `${baseURL}assets/images/logo.png`;
 
  let gearURL = `${baseURL}assets/images/logo192.png`;

  return {
    productKind,
    logoURL,
    name,
    gearURL,
  };
};

export const copy2Clipboard = (value: string, type: string) => {
  navigator.clipboard.writeText(value);

  clearAllToast();

  infoToast(`${type} copied to the clipboard`, {
    position: 'bottom-left',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
};

export const logInfo = (data: any) => {
  if (!isProduction) {
    console.log(JSON.stringify(data, null, 2));
  }
};

export const logError = (error: any) => {
  console.error(error);
};

export const getTimezoneOffset = () => {
  const d = new Date();
  const n = d.getTimezoneOffset();
  return n;
};

export const randomColorsGenerator = () => {
  const index = Math.floor(Math.random() * Colors.length);

  return Colors[index];
};

export const statusDeleteFilterParams = (filters: IStatusFilterOptions[]) => {
  let isActiveFilter: boolean | null = null;
  let isDeletedFilter: boolean | null = null;

  let value = 0;

  filters.forEach((filter) => {
    value = value | filter.value;
  });

  //  If deleted status is selected
  if (value & StatusFilterValues.deleted) {
    isDeletedFilter = true;
  }

  //  If Active status is selected and InActive is not selected
  if (
    value & StatusFilterValues.active &&
    !(value & StatusFilterValues.inActive)
  ) {
    isActiveFilter = true;
  }

  //  If InActive status is selected and Active is not selected
  if (
    value & StatusFilterValues.inActive &&
    !(value & StatusFilterValues.active)
  ) {
    isActiveFilter = false;
  }

  return { isActiveFilter, isDeletedFilter };
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const strInitials = (value: string) => {
  return value
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), '');
};

export const generateUniqueId = () => {
  return uuidv4();
};

/**
 * Checks whether the argument is an object
 * @param {any} o
 */
export const isObject = (o: any) => {
  return o && !Array.isArray(o) && Object(o) === o;
};

export const dataURLToFile = async (
  media: string,
  mediaContentType: string,
  mediaName: string
) => {
  const blob = await (await fetch(media)).blob();
  const file = new File([blob], mediaName, {
    type: mediaContentType,
    //@ts-ignore
    lastModified: new Date(),
  });

  return file;
};

//  This converts the number to Perm boolean objects
export const convertToPermisson = (
  value: number = CommonPerms.none
): Record<ICommonPermTypes, boolean> => {
  return {
    none: !!(value & CommonPerms.none),
    all: !!(value & CommonPerms.all),
    view: !!(value & (CommonPerms.all | CommonPerms.view)),
    add: !!(value & (CommonPerms.all | CommonPerms.add)),
    edit: !!(value & (CommonPerms.all | CommonPerms.edit)),
    delete: !!(value & (CommonPerms.all | CommonPerms.delete)),
    timeline: !!(value & (CommonPerms.all | CommonPerms.timeline)),
    invite: !!(value & (CommonPerms.all | CommonPerms.invite)),
  };
};

export const formatPrice = (value: number, decimals: number = 2) => {
  if (!value) {
    return 0;
  }

  value = value / 100;

  return Number(
    Math.round(Number(`${value}` + 'e' + `${decimals}`)) + 'e-' + decimals
  );
};

export const generateMongoId = () => {
  return `${objectId()}`;
};

export function forceCastTS<T>(input: any): T {
  // ... do runtime checks here

  // @ts-ignore <-- forces TS compiler to compile this as-is
  return input;
}
