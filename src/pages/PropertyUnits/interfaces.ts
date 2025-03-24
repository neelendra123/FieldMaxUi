import {
  ICommonAddress,
  ICommonMediaUpload,
  ICommonResponse,
} from '../../interfaces';
import { IOption } from '../../interfaces';

import { ICommonAccess } from '../Common/interfaces';
import { IPropertyJobPopulated } from '../Jobs/interfaces';

import { INotePopulated } from '../Notes/interfaces';

export interface IPropertyUnitRMIntegrations {
  enabled: boolean;

  UnitID: number;
  PropertyID: number;
  LocationID: number;
  updatedAt: Date | null;
}

export interface IPropertyUnit {
  id: string;

  primaryUserId: string;
  creatorId: string;

  pic?: string;
  picURL?: string;

  propertyId: string;

  unitTypes: string[];
  notes: string[];
  jobs: string[];

  name: string;

  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  taxId?: string;
  comments: string;

  primaryAddress: ICommonAddress;
  addresses: ICommonAddress[];

  access: ICommonAccess;

  rm: IPropertyUnitRMIntegrations;

  isDefault: boolean;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

//  Creating or Updating Tabs
export enum IPropertyUnitCreateUpdateTabsType {
  generalInfo = 'generalInfo',
  notes = 'notes',
  access = 'access',
  integrations = 'integrations',
  jobs = 'jobs',
  timeLine = 'timeLine',
}

export interface IPropertyUnitCreateEditBackup {
  activeTab: IPropertyUnitCreateUpdateTabsType;

  id: string;

  name: string;
  unitTypes: IOption[];
  pic: ICommonMediaUpload;
  // taxId: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  comments: string;
  taxId?: string;
  //  Tab General Info
  addresses: ICommonAddress[];

  //  Tab Notes & History
  notes: INotePopulated[];
  //  Tab Access
  access: ICommonAccess;
  //  Tab Integrations
  rm: IPropertyUnitRMIntegrations;
}

export interface IPropertyUnitListAll {
  id: string;

  name: string;

  pic?: string;
  picURL?: string;

  primaryAddress: ICommonAddress;

  isDefault: boolean;
}
export interface IPropertyUnitsListAllReqData {
  //Either one of them is required
  propertyId?: string;
  propertyUnitsIds?: string[];
}
export interface IPropertyUnitsListAllResData extends ICommonResponse {
  data: {
    records: IPropertyUnitListAll[];
  };
}

export interface IPropertyUnitPopulated {
  id: string;
  name: string;
  primaryAddress: ICommonAddress;
  pic?: string;
  picURL?: string;
  isDefault: boolean;
}

export interface IPropertyUnitDetailsResData extends ICommonResponse {
  data: {
    record: IPropertyUnitDetailsPopulated;
  };
}

//  Create & Edit Req Data Common
export interface IPropertyUnitCreateEditCommonReqData {
  pic?: string;
  name: string;
  unitTypes: string[];
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  comments: string;
  taxId?: string;
  //  Tab General Info
  primaryAddress?: ICommonAddress;
  addresses?: ICommonAddress[];
  //  Tab Access
  access?: ICommonAccess;
  //  Tab Integrations
  rm?: Omit<
    IPropertyUnitRMIntegrations,
    'UnitID' | 'PropertyID' | 'LocationID' | 'updatedAt'
  >;
}

//  Create
export interface IPropertyUnitCreateReqData
  extends IPropertyUnitCreateEditCommonReqData {
  defaultId: string;

  propertyId: string;
  skipPropertyCheck: boolean;
  //  Tab Notes
  notes: string[];
}
export interface IPropertyUnitCreateResData extends ICommonResponse {
  data: {
    record: IPropertyUnit;
  };
}

//  Edit
export interface IPropertyUnitEditReqData
  extends IPropertyUnitCreateEditCommonReqData {}
export interface IPropertyUnitEditResData extends ICommonResponse {
  data: {
    record: IPropertyUnit;
  };
}

export interface IPropertyUnitDetailsPopulated
  extends Omit<IPropertyUnit, 'primaryUserId' | 'creatorId' | 'jobs'> {
  jobs: IPropertyJobPopulated[];
}
