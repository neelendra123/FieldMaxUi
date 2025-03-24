import { CommonPerms } from '../../constants';
import { IProductKind } from '../../interfaces';
import { convertToPermisson } from '../../utils/common';

import { IUserType } from '../Users/interfaces';
import { getUserTypes } from '../Users/utils';

import * as interfaces from './interfaces';

//////////////////////////
//  Sub Module -> Account Level
//////////////////////////
export const generateAccountSubModulePerms = (
  defaultVal = CommonPerms.none
): interfaces.IAccountSubModulePerms => {
  const perms: interfaces.IAccountSubModulePerms = {
    base: defaultVal,
  };

  return perms;
};

//////////////////////////
//  Sub Module -> User Level
//////////////////////////
export const generateUserSubModulePerms = (
  defaultVal = CommonPerms.none
): interfaces.IUserSubModulePerms => {
  const perms: interfaces.IUserSubModulePerms = {
    base: defaultVal,
    notes: defaultVal,
  };

  return perms;
};

//////////////////////////
//  Sub Module -> Owner Level
//////////////////////////
export const generateUserOwnerSubModulePerms = (
  defaultVal = CommonPerms.none
): interfaces.IUserOwnerSubModulePerms => {
  const perms: interfaces.IUserOwnerSubModulePerms = {
    base: defaultVal,
    generalInfo: defaultVal,
    properties: defaultVal,
    notes: defaultVal,
    access: defaultVal,
    integrations: defaultVal,
  };

  return perms;
};

//////////////////////////
//  Sub Module -> User Level
//////////////////////////
export const generateResidentSubModulePerms = (
  defaultVal = CommonPerms.none
): interfaces.IResidentSubModulePerms => {
  const perms: interfaces.IResidentSubModulePerms = {
    base: defaultVal,
    notes: defaultVal,
  };

  return perms;
};

//////////////////////////
//  Sub Module -> Role Level
//////////////////////////
export const generateRoleSubModulePerms = (
  defaultVal = CommonPerms.none
): interfaces.IRoleSubModulePerms => {
  const perms: interfaces.IRoleSubModulePerms = {
    base: defaultVal,
  };

  return perms;
};

//////////////////////////
//  Sub Module -> Job Level
//////////////////////////
export const generateJobSubModulePerms = (
  defaultVal = CommonPerms.none
): interfaces.IJobSubModulePerms => {
  const perms: interfaces.IJobSubModulePerms = {
    parent: defaultVal,
    base: defaultVal,
    mediaPhotos: defaultVal,
    mediaVideos: defaultVal,
    documents: defaultVal,
    conversations: defaultVal,
    notes: defaultVal,
    comments: defaultVal,
    members: defaultVal,
  };

  return perms;
};

//////////////////////////
//  Sub Module -> Product Level
//////////////////////////
export const generateProductSubModulePerms = (
  defaultVal = CommonPerms.none
): interfaces.IProductSubModulePerms => {
  const perms: interfaces.IProductSubModulePerms = {
    base: defaultVal,
  };

  return perms;
};

//////////////////////////
//  Sub Module -> Property Level
//////////////////////////
export const generatePropertySubModulePerms = (
  defaultVal = CommonPerms.none
): interfaces.IPropertySubModulePerms => {
  const perms: interfaces.IPropertySubModulePerms = {
    base: defaultVal,
    generalInfo: defaultVal,
    userOwners: defaultVal,
    propertyUnits: defaultVal,
    jobs: defaultVal,
    notes: defaultVal,
    access: defaultVal,
    integrations: defaultVal,
  };

  return perms;
};

//////////////////////////
//  Sub Module -> Integration Common
//////////////////////////
export const generateIntegrationCommonSubModulePerms = (
  defaultVal = CommonPerms.none
): interfaces.IIntegrationCommonSubModulePerms => {
  const perms: interfaces.IIntegrationCommonSubModulePerms = {
    base: defaultVal,
    propertyTypes: defaultVal,
    addressTypes: defaultVal,
    chargeTypes: defaultVal,
    unitTypes: defaultVal,
    serviceManagerCategories: defaultVal,
    serviceManagerPriorities: defaultVal,
    serviceManagerStatuses: defaultVal,
  };

  return perms;
};

//////////////////////////
//  Org Module Parent
//////////////////////////
export const generateDefaultOrgPerms = (): interfaces.IOrgPerms => {
  const perms: interfaces.IOrgPerms = {
    account: generateAccountSubModulePerms(),

    users: generateUserSubModulePerms(),
    userOwners: generateUserOwnerSubModulePerms(),
    residents: generateUserSubModulePerms(),

    jobs: generateJobSubModulePerms(),

    products: generateProductSubModulePerms(),

    roles: generateRoleSubModulePerms(),

    properties: generatePropertySubModulePerms(),

    integrationCommons: generateIntegrationCommonSubModulePerms(),
  };

  return perms;
};

export const addOrgPerms = (
  userType: number = IUserType.user,
  productKind: number = IProductKind.camMax,
  data: interfaces.IOrgPerms = generateDefaultOrgPerms()
): interfaces.IOrgPerms => {
  const isSuperAdmin = !!(userType & IUserType.superAdmin);
  const isAdmin = !!(userType & IUserType.admin);
  const isOwner = !!(userType & IUserType.owner);

  let permissions: interfaces.IOrgPerms = {
    ...generateDefaultOrgPerms(),
    ...data,
  };

  //  TO Do add specific permission to owner
  if (isSuperAdmin || isAdmin || isOwner) {
    // Object.keys(permissions).forEach((module) => {
    //   Object.keys(permissions[module]).forEach((subModule) => {
    //     permissions[module][subModule] = CommonPerms.all;
    //   });
    // });

    return permissions;
  }

  return permissions;
};

export const generateOrgParsedPerms = (
  baseUserType: number = IUserType.user,
  accountUserType: number = IUserType.basic,
  permissions = generateDefaultOrgPerms()
) => {
  const authUserType = getUserTypes(baseUserType, accountUserType);

  let result: interfaces.IParsedOrgSubModulePerms = {
    account: {
      base: convertToPermisson(permissions.account.base),
    },
    users: {
      base: convertToPermisson(permissions.users.base),
      notes: convertToPermisson(permissions.users.notes),
    },
    userOwners: {
      base: convertToPermisson(permissions.userOwners.base),
      generalInfo: convertToPermisson(permissions.userOwners.generalInfo),
      properties: convertToPermisson(permissions.userOwners.properties),
      notes: convertToPermisson(permissions.userOwners.notes),
      access: convertToPermisson(permissions.userOwners.access),
      integrations: convertToPermisson(permissions.userOwners.integrations),
    },
    residents: {
      base: convertToPermisson(permissions.residents.base),
      notes: convertToPermisson(permissions.residents.notes),
    },

    jobs: {
      base: convertToPermisson(permissions.jobs.base),
      mediaPhotos: convertToPermisson(permissions.jobs.mediaPhotos),
      mediaVideos: convertToPermisson(permissions.jobs.mediaVideos),
      documents: convertToPermisson(permissions.jobs.documents),
      conversations: convertToPermisson(permissions.jobs.conversations),
      notes: convertToPermisson(permissions.jobs.notes),
      comments: convertToPermisson(permissions.jobs.comments),
      members: convertToPermisson(permissions.jobs.members),
      //  Not at backend
      parent: convertToPermisson(permissions.jobs.parent),
    },

    products: {
      base: convertToPermisson(permissions.products.base),
    },

    roles: {
      base: convertToPermisson(permissions.roles.base),
    },

    properties: {
      base: convertToPermisson(permissions.properties.base),
      generalInfo: convertToPermisson(permissions.properties.generalInfo),
      userOwners: convertToPermisson(permissions.properties.userOwners),
      propertyUnits: convertToPermisson(permissions.properties.propertyUnits),
      jobs: convertToPermisson(permissions.properties.jobs),
      notes: convertToPermisson(permissions.properties.notes),
      access: convertToPermisson(permissions.properties.access),
      integrations: convertToPermisson(permissions.properties.integrations),
    },

    integrationCommons: {
      base: convertToPermisson(permissions.integrationCommons.base),

      propertyTypes: convertToPermisson(
        permissions.integrationCommons.propertyTypes
      ),
      addressTypes: convertToPermisson(
        permissions.integrationCommons.addressTypes
      ),
      chargeTypes: convertToPermisson(
        permissions.integrationCommons.chargeTypes
      ),

      unitTypes: convertToPermisson(permissions.integrationCommons.unitTypes),

      serviceManagerCategories: convertToPermisson(
        permissions.integrationCommons.serviceManagerCategories
      ),
      serviceManagerPriorities: convertToPermisson(
        permissions.integrationCommons.serviceManagerPriorities
      ),
      serviceManagerStatuses: convertToPermisson(
        permissions.integrationCommons.serviceManagerStatuses
      ),
    },
  };

  if (
    authUserType.isSuperAdmin ||
    authUserType.isAdmin ||
    authUserType.isOwner
  ) {
    //  This is for converting all permissions to true
    for (const [moduleKind, modulePerms] of Object.entries(result)) {
      for (const [subModuleKind, subModule] of Object.entries(modulePerms)) {
        for (const key of Object.keys(subModule)) {
          //@ts-ignore
          result[moduleKind][subModuleKind][key] = true;
        }
      }
    }
  }

  return result;
};
