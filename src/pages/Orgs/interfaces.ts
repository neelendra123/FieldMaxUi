import { ICommonPermTypes, IModuleKind } from '../../interfaces';

import { IInvite } from '../Invites/interfaces';

//////////////////////////
//  Sub Module -> Account Level
//////////////////////////
export enum IAccountSubModuleTypes {
  base = 'base',
}
export type IAccountSubModulePerms = Record<IAccountSubModuleTypes, number>;

//////////////////////////
//  Sub Module -> User Level
//////////////////////////
export enum IUserSubModuleTypes {
  base = 'base',
  notes = 'notes',
}
export type IUserSubModulePerms = Record<IUserSubModuleTypes, number>;

//////////////////////////
//  Sub Module -> Resident Level
//////////////////////////
export enum IUserOwnerSubModuleTypes {
  base = 'base',
  generalInfo = 'generalInfo',
  properties = 'properties',
  notes = 'notes',
  access = 'access',
  integrations = 'integrations',
}
export type IUserOwnerSubModulePerms = Record<IUserOwnerSubModuleTypes, number>;

//////////////////////////
//  Sub Module -> Resident Level
//////////////////////////
export enum IResidentSubModuleTypes {
  base = 'base',
  notes = 'notes',
}
export type IResidentSubModulePerms = Record<IResidentSubModuleTypes, number>;

//////////////////////////
//  Sub Module -> Role Level
//////////////////////////
export enum IRoleSubModuleTypes {
  base = 'base',
}
export type IRoleSubModulePerms = Record<IRoleSubModuleTypes, number>;

//////////////////////////
//  Sub Module -> Job Level
//////////////////////////
export enum IJobSubModuleTypes {
  base = 'base',
  mediaPhotos = 'mediaPhotos',
  mediaVideos = 'mediaVideos',
  documents = 'documents',
  conversations = 'conversations',
  notes = 'notes',
  comments = 'comments',
  members = 'members',
  //  Not at backend
  parent = 'parent',
}
export type IJobSubModulePerms = Record<IJobSubModuleTypes, number>;

//////////////////////////
//  Sub Module -> Product Level
//////////////////////////
export enum IProductSubModuleTypes {
  base = 'base',
}
export type IProductSubModulePerms = Record<IProductSubModuleTypes, number>;

//////////////////////////
//  Sub Module -> Property Level
//////////////////////////
export enum IPropertySubModuleTypes {
  base = 'base',
  generalInfo = 'generalInfo',
  userOwners = 'userOwners',
  propertyUnits = 'propertyUnits',
  jobs = 'jobs',
  notes = 'notes',
  access = 'access',
  integrations = 'integrations',
}
export type IPropertySubModulePerms = Record<IPropertySubModuleTypes, number>;

//////////////////////////
//  Sub Module -> Integration Common
//////////////////////////
export enum IIntegrationCommonSubModuleTypes {
  base = 'base',

  propertyTypes = 'propertyTypes',
  addressTypes = 'addressTypes',
  chargeTypes = 'chargeTypes',

  unitTypes = 'unitTypes',

  serviceManagerCategories = 'serviceManagerCategories',
  serviceManagerPriorities = 'serviceManagerPriorities',
  serviceManagerStatuses = 'serviceManagerStatuses',
}
export type IIntegrationCommonSubModulePerms = Record<
  IIntegrationCommonSubModuleTypes,
  number
>;

//////////////////////////
//  Org Module Parent
//////////////////////////
export interface IOrgPerms {
  [IModuleKind.account]: IAccountSubModulePerms;

  [IModuleKind.users]: IUserSubModulePerms;
  [IModuleKind.userOwners]: IUserOwnerSubModulePerms;
  [IModuleKind.residents]: IResidentSubModulePerms;

  [IModuleKind.roles]: IRoleSubModulePerms;

  [IModuleKind.jobs]: IJobSubModulePerms;

  [IModuleKind.products]: IProductSubModulePerms;

  [IModuleKind.properties]: IPropertySubModulePerms;

  [IModuleKind.integrationCommons]: IIntegrationCommonSubModulePerms;
}

export interface IOrgAccess {
  primaryUserId: string;
  permissions: IOrgPerms;
  userType: number;

  isDefault: boolean;
  isBlocked: boolean;

  invite: IInvite;

  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export type IParsedOrgSubModulePerms = {
  [IModuleKind.account]: Record<
    IAccountSubModuleTypes,
    Record<ICommonPermTypes, boolean>
  >;

  [IModuleKind.users]: Record<
    IUserSubModuleTypes,
    Record<ICommonPermTypes, boolean>
  >;
  [IModuleKind.userOwners]: Record<
    IUserOwnerSubModuleTypes,
    Record<ICommonPermTypes, boolean>
  >;
  [IModuleKind.residents]: Record<
    IResidentSubModuleTypes,
    Record<ICommonPermTypes, boolean>
  >;

  [IModuleKind.roles]: Record<
    IRoleSubModuleTypes,
    Record<ICommonPermTypes, boolean>
  >;

  [IModuleKind.jobs]: Record<
    IJobSubModuleTypes,
    Record<ICommonPermTypes, boolean>
  >;

  [IModuleKind.products]: Record<
    IProductSubModuleTypes,
    Record<ICommonPermTypes, boolean>
  >;

  [IModuleKind.properties]: Record<
    IPropertySubModuleTypes,
    Record<ICommonPermTypes, boolean>
  >;

  [IModuleKind.integrationCommons]: Record<
    IIntegrationCommonSubModuleTypes,
    Record<ICommonPermTypes, boolean>
  >;
};
