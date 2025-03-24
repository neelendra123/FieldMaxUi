import { ICommonListingParams, ICommonResponse } from '../../interfaces';

import { IOrgPerms, IJobSubModulePerms } from '../Orgs/interfaces';
import { ISubMediaUserPerms } from '../Medias/interfaces';

export enum IRoleKinds {
  accountRole = 'accountRole',
  jobRole = 'jobRole',
  jobMediaRole = 'jobMediaRole',
}

//////////////////////////
//  Roles Discriminators
//////////////////////////
export interface IRole {
  id: string;

  primaryUserId: string;
  creatorId: string;

  name: string;
  description?: string;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface IAccountRole extends IRole {
  kind: IRoleKinds.accountRole;

  permissions: IOrgPerms;

  isSuperAdmin: boolean;
  isAdmin: boolean;
  isOwner: boolean;
}

export interface IJobRole extends IRole {
  kind: IRoleKinds.jobRole;

  permissions: IJobSubModulePerms;
}

export interface IJobMediaRole extends IRole {
  kind: IRoleKinds.jobMediaRole;

  permissions: ISubMediaUserPerms;
}

//  Listing
export interface IRolesListReqData extends ICommonListingParams {}
export interface IRolesListResData extends ICommonResponse {
  data: {
    count: number;
    list: IAccountRole[] | IJobRole[] | IJobMediaRole[];
  };
}

export interface ICommonRoleResData extends ICommonResponse {
  data: {
    role: IAccountRole | IJobRole | IJobMediaRole;
  };
}

export interface IRoleAddFormData {
  kind: IRoleKinds;
  name: string;
  description?: string;
  permissions: IOrgPerms | IJobSubModulePerms | ISubMediaUserPerms;
}

export interface IRoleUpdateFormData {
  name: string;
  description?: string;
  isActive: boolean;
  permissions: IOrgPerms | IJobSubModulePerms | ISubMediaUserPerms;
}
