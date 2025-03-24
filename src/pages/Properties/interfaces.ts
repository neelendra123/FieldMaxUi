import {
  ICommonResponse,
  ICommonAddress,
  ICommonListingParams,
  ICommonMediaUpload,
  IOption,
} from '../../interfaces';

import { ICommonAccess } from '../Common/interfaces';

import { IPropertyJobPopulated } from '../Jobs/interfaces';

import { INotePopulated } from '../Notes/interfaces';
import { IPropertyUnitPopulated } from '../PropertyUnits/interfaces';

import {
  IUserOwnerListAllRes,
  IUserOwnerPopulated,
} from '../UserOwners/interfaces';

export interface IPropertyRMIntegrations {
  enabled: boolean;

  PropertyID: number;
  LocationID: number;
  updatedAt: Date | null;
}

export interface IProperty {
  id: string;

  primaryUserId?: string;
  creatorId?: string;

  propertyUnits: string[];
  userOwners: string[];
  notes: string[];
  jobs: string[];

  chargeTypes: string[];
  propertyTypes: string[];

  name: string;
  shortName: string;

  taxId: string;
  pic?: string;
  squareFootage: number;
  comments: string;

  primaryAddress: ICommonAddress;
  billingAddress: ICommonAddress;
  addresses: ICommonAddress[];

  access: ICommonAccess;

  rm: IPropertyRMIntegrations;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;

  picURL?: string;
}

//  Job Listing
export interface IPropertiesListReqData extends ICommonListingParams {}
export interface IPropertiesListResData extends ICommonResponse {
  data: {
    count: number;
    records: IProperty[];
  };
}

//  Add
export interface IPropertyAddReqData {
  name: string;
  shortName: string;

  pic?: string;
  taxId: string;
  squareFootage: number;
  comments: string;
  propertyTypes: string[];
  chargeTypes: string[];
  //  Tab General Info
  primaryAddress: ICommonAddress;
  billingAddress: ICommonAddress;
  addresses: ICommonAddress[];
  //  Tab Units
  propertyUnits: string[];
  //  Tab Owners
  userOwners: string[];
  //  Tab Notes & History
  notes: string[];
  //  Tab Access
  access: ICommonAccess;
  //  Tab Integrations
  rm: IPropertyRMIntegrations;
}
export interface IPropertyAddResData extends ICommonResponse {
  data: {
    record: IProperty;
  };
}

//  Edit
export interface IPropertyEditReqData {
  name: string;
  shortName: string;

  pic?: string;
  taxId: string;
  squareFootage: number;
  comments: string;
  propertyTypes: string[];
  chargeTypes: string[];
  //  Tab General Info
  primaryAddress?: ICommonAddress;
  billingAddress?: ICommonAddress;
  addresses?: ICommonAddress[];
  //  Tab Units
  propertyUnits?: string[];
  //  Tab Owners
  userOwners?: string[];
  //  Tab Notes & History
  notes?: string[];
  //  Tab Access
  access?: ICommonAccess;
  //  Tab Integrations
  rm?: IPropertyRMIntegrations;
}
export interface IPropertyEditResData extends ICommonResponse {
  data: {
    record: IPropertyDetailsPopulated;
  };
}

//  List All
export interface IPropertyListAll {
  id: string;

  name: string;
  shortName: string;

  primaryAddress: ICommonAddress;

  propertyUnits: {
    id: string;
    name: string;
    primaryAddress: ICommonAddress;
  }[];
}
export interface IPropertyListAllResData extends ICommonResponse {
  data: {
    records: IPropertyListAll[];
    googleRecords: ICommonAddress[];
  };
}

//  Creating
export enum IPropertyCreateUpdateTabsType {
  generalInfo = 'generalInfo',
  userOwners = 'userOwners',
  propertyUnits = 'propertyUnits',
  notes = 'notes',
  jobs = 'jobs',
  access = 'access',
  integrations = 'integrations',
  timeLine = 'timeLine',
}

export interface IPropertyCreateEditBackup {
  activeTab: IPropertyCreateUpdateTabsType;

  id: string;

  pic: ICommonMediaUpload;
  name: string;
  shortName: string;
  taxId: string;
  squareFootage: number;
  comments: string;
  propertyTypes: IOption[];
  chargeTypes: IOption[];
  //  Tab General Info
  addresses: ICommonAddress[];
  //  Tab UserOwners
  userOwners: string[];
  //  Tab Units
  // propertyUnits: string[];
  propertyUnits: string[];
  //  Tab Notes & History
  notes: INotePopulated[];
  //  Tab Access
  access: ICommonAccess;
  //  Tab Integrations
  rm: IPropertyRMIntegrations;
}

export interface IPropertyUserOwnersListAll
  extends IUserOwnerListAllRes,
    IOption {
  isSelected: boolean;
}

export interface IPropertyDetailsPopulated
  extends Omit<
    IProperty,
    'primaryUserId' | 'creatorId' | 'userOwners' | 'propertyUnits' | 'jobs'
  > {
  userOwners: IUserOwnerPopulated[];
  propertyUnits: IPropertyUnitPopulated[];
  jobs: IPropertyJobPopulated[];
}

export interface IPropertyDetailsResData extends ICommonResponse {
  data: {
    record: IPropertyDetailsPopulated;
  };
}
