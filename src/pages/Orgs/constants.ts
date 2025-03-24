import Joi, { ObjectSchema, NumberSchema } from 'joi';
import { CommonPerms } from '../../constants';

import { IModuleKind } from '../../interfaces';

import * as interfaces from './interfaces';

//////////////////////////
//  Sub Module -> Account Level
//////////////////////////
export const AccountSubModulePermsValsSchema: Record<
  interfaces.IAccountSubModuleTypes,
  NumberSchema
> = {
  base: Joi.number().min(1).default(CommonPerms.none).required(),
};

//////////////////////////
//  Sub Module -> Role Level
//////////////////////////
export const RoleSubModuleValsSchema: Record<
  interfaces.IRoleSubModuleTypes,
  NumberSchema
> = {
  base: Joi.number().min(1).default(CommonPerms.none).required(),
};

//////////////////////////
//  Sub Module -> User Level
//////////////////////////
export const UserSubModuleValsSchema: Record<
  interfaces.IUserSubModuleTypes,
  NumberSchema
> = {
  base: Joi.number().min(1).default(CommonPerms.none).required(),
  notes: Joi.number().min(1).default(CommonPerms.none).required(),
};

//////////////////////////
//  Sub Module -> Owner Level
//////////////////////////
export const UserOwnerSubModuleValsSchema: Record<
  interfaces.IUserOwnerSubModuleTypes,
  NumberSchema
> = {
  base: Joi.number().min(1).default(CommonPerms.none).required(),
  generalInfo: Joi.number().min(1).default(CommonPerms.none).required(),
  properties: Joi.number().min(1).default(CommonPerms.none).required(),
  notes: Joi.number().min(1).default(CommonPerms.none).required(),
  access: Joi.number().min(1).default(CommonPerms.none).required(),
  integrations: Joi.number().min(1).default(CommonPerms.none).required(),
};

//////////////////////////
//  Sub Module -> Resident Level
//////////////////////////
export const ResidentSubModuleValsSchema: Record<
  interfaces.IUserSubModuleTypes,
  NumberSchema
> = {
  base: Joi.number().min(1).default(CommonPerms.none).required(),
  notes: Joi.number().min(1).default(CommonPerms.none).required(),
};

//////////////////////////
//  Sub Module -> Job Level
//////////////////////////
export const JobSubModulePermsValsSchema: Record<
  interfaces.IJobSubModuleTypes,
  NumberSchema
> = {
  parent: Joi.number().min(1).default(CommonPerms.none).optional(),

  base: Joi.number().min(1).default(CommonPerms.none).required(),

  mediaPhotos: Joi.number().min(1).default(CommonPerms.none).required(),
  mediaVideos: Joi.number().min(1).default(CommonPerms.none).required(),
  documents: Joi.number().min(1).default(CommonPerms.none).required(),

  conversations: Joi.number().min(1).default(CommonPerms.none).required(),
  notes: Joi.number().min(1).default(CommonPerms.none).required(),
  comments: Joi.number().min(1).default(CommonPerms.none).required(),

  members: Joi.number().min(1).default(CommonPerms.none).required(),
};

//////////////////////////
//  Sub Module -> Product Level
//////////////////////////
export const ProductSubModuleValsSchema: Record<
  interfaces.IProductSubModuleTypes,
  NumberSchema
> = {
  base: Joi.number().min(1).default(CommonPerms.none).required(),
};

//////////////////////////
//  Sub Module -> Property Level
//////////////////////////
export const PropertySubModuleValsSchema: Record<
  interfaces.IPropertySubModuleTypes,
  NumberSchema
> = {
  base: Joi.number().min(1).default(CommonPerms.none).required(),
  generalInfo: Joi.number().min(1).default(CommonPerms.none).required(),
  userOwners: Joi.number().min(1).default(CommonPerms.none).required(),
  propertyUnits: Joi.number().min(1).default(CommonPerms.none).required(),
  jobs: Joi.number().min(1).default(CommonPerms.none).required(),
  notes: Joi.number().min(1).default(CommonPerms.none).required(),
  access: Joi.number().min(1).default(CommonPerms.none).required(),
  integrations: Joi.number().min(1).default(CommonPerms.none).required(),
};

//////////////////////////
//  Sub Module -> Integration Common
//////////////////////////
export const IntegrationCommonSubModuleValsSchema: Record<
  interfaces.IIntegrationCommonSubModuleTypes,
  NumberSchema
> = {
  base: Joi.number().min(1).default(CommonPerms.none).required(),

  propertyTypes: Joi.number().min(1).default(CommonPerms.none).required(),
  addressTypes: Joi.number().min(1).default(CommonPerms.none).required(),
  chargeTypes: Joi.number().min(1).default(CommonPerms.none).required(),

  unitTypes: Joi.number().min(1).default(CommonPerms.none).required(),

  serviceManagerCategories: Joi.number()
    .min(1)
    .default(CommonPerms.none)
    .required(),
  serviceManagerPriorities: Joi.number()
    .min(1)
    .default(CommonPerms.none)
    .required(),
  serviceManagerStatuses: Joi.number()
    .min(1)
    .default(CommonPerms.none)
    .required(),
};

//////////////////////////
//  Org Module Parent
//////////////////////////
export const OrgPermsValsSchema: Record<IModuleKind, ObjectSchema> = {
  account: Joi.object().keys(AccountSubModulePermsValsSchema).required(),

  users: Joi.object().keys(UserSubModuleValsSchema).required(),
  userOwners: Joi.object().keys(UserOwnerSubModuleValsSchema).required(),
  residents: Joi.object().keys(ResidentSubModuleValsSchema).required(),

  jobs: Joi.object().keys(JobSubModulePermsValsSchema).required(),
  products: Joi.object().keys(ProductSubModuleValsSchema).required(),

  roles: Joi.object().keys(RoleSubModuleValsSchema).required(),

  properties: Joi.object().keys(PropertySubModuleValsSchema).required(),

  integrationCommons: Joi.object()
    .keys(IntegrationCommonSubModuleValsSchema)
    .required(),
};
