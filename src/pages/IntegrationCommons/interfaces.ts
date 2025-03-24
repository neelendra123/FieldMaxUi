import { ICommonListingParams, ICommonResponse } from '../../interfaces';
import {
  IIntegrationCommonSubModuleTypes,
  IIntegrationCommonSubModulePerms,
} from '../Orgs/interfaces';

////////////////////////////////////////////////////
//  Parent -> Integration Common
////////////////////////////////////////////////////
export interface IIntegrationCommon {
  id: string;

  kind: IIntegrationCommonSubModuleTypes;

  primaryUserId: string;
  creatorId: string;

  name: string;
  description: string;

  rmUpdatedAt: Date | null;

  color: string;

  bold: boolean;
  italic: boolean;
  underline: boolean;

  isActive: boolean;
  isGlobal: boolean;
  isDeleted: boolean;
}

////////////////////////////////////////////////////
//  Discriminator -> Property Type
////////////////////////////////////////////////////
export interface IPropertyTypes extends IIntegrationCommon {
  kind: IIntegrationCommonSubModuleTypes.propertyTypes;

  RMPropertyTypeID: number;
}

////////////////////////////////////////////////////
//  Discriminator -> Address Type
////////////////////////////////////////////////////
export interface IAddressTypes extends IIntegrationCommon {
  kind: IIntegrationCommonSubModuleTypes.addressTypes;

  RMLocationID: number;
  RMAddressTypeID: number;

  sortOrder: number;
}

////////////////////////////////////////////////////
//  Discriminator -> Charge Type
////////////////////////////////////////////////////
export interface IChargeTypes extends IIntegrationCommon {
  kind: IIntegrationCommonSubModuleTypes.chargeTypes;

  RMLocationID: number;
  RMChargeTypeID: number;

  defaultAmount: number;
}

////////////////////////////////////////////////////
//  Discriminator -> Unit Type
////////////////////////////////////////////////////
export interface IUnitTypes extends IIntegrationCommon {
  kind: IIntegrationCommonSubModuleTypes.unitTypes;

  RMLocationID: number;
  RMUnitTypeID: number;

  comment: string;
}

////////////////////////////////////////////////////
//  Discriminator -> ServiceManagerCategories
////////////////////////////////////////////////////
export interface IServiceManagerCategories extends IIntegrationCommon {
  kind: IIntegrationCommonSubModuleTypes.serviceManagerCategories;

  RMLocationID: number;
  RMServiceManagerCategoryID: number;

  sortOrder: number;
  isActive: boolean;
}
////////////////////////////////////////////////////
//  Discriminator -> ServiceManagerPriorities
////////////////////////////////////////////////////
export interface IServiceManagerPriorities extends IIntegrationCommon {
  kind: IIntegrationCommonSubModuleTypes.serviceManagerPriorities;

  RMLocationID: number;
  RMServiceManagerPriorityID: number;

  sortOrder: number;
  isActive: boolean;
}
////////////////////////////////////////////////////
//  Discriminator -> ServiceManagerStatuses
////////////////////////////////////////////////////
export interface IServiceManagerStatuses extends IIntegrationCommon {
  kind: IIntegrationCommonSubModuleTypes.serviceManagerStatuses;

  RMLocationID: number;
  RMServiceManagerStatusID: number;

  sortOrder: number;
  isActive: boolean;
}

export type IIntegrationCommonTypes =
  | IPropertyTypes
  | IAddressTypes
  | IChargeTypes
  | IUnitTypes
  | IServiceManagerCategories
  | IServiceManagerPriorities
  | IServiceManagerStatuses;

////////////////////////////////////////////////////
//  Api's
////////////////////////////////////////////////////

export interface IntegrationCommonListAllResData extends ICommonResponse {
  data: {
    list: Record<IIntegrationCommonSubModuleTypes, IIntegrationCommon[]>;
  };
}

export interface IntegrationCommonListReqData extends ICommonListingParams {}

export interface IntegrationCommonListResData extends ICommonResponse {
  data: {
    count: IIntegrationCommonSubModulePerms;
    list: IIntegrationCommonTypes[];
  };
}

export interface IntegrationCommonCreateEditReqData {
  name: string;
  description: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
}
export interface IIntegrationCommonCreateEditResData extends ICommonResponse {
  data: {};
}
