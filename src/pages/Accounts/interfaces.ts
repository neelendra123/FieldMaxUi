import { ICommonAddress, ICommonResponse } from '../../interfaces';
import { IIntegrations } from '../Integrations/interfaces';

import { ITheme } from '../Users/interfaces';

export interface IAccountUsageLimit {
  users: number;
  userOwners: number;
  properties: number;
  propertyUnits: number;
  jobs: number;
  medias: number;
}

export interface IAccount {
  name: string;
  address: ICommonAddress;
  phone: string;
  primaryEmail: string;
  logo: string;
  logoURL: string;

  isActive: boolean;
  isDeleted: boolean;

  usage?: IAccountUsageLimit;
  limit?: IAccountUsageLimit;

  createdAt: string;
  updatedAt: string;
}

export interface IAccountDetails {
  id: string;
  account: IAccount;
  integrations: IIntegrations;
}

export interface IAccountResData extends ICommonResponse {
  data: {
    account: IAccountDetails;
  };
}

export interface IAccountEditReqData {
  name: string;
  address: ICommonAddress;
  phone: string;
  primaryEmail: string;
  logo?: string;
  theme: ITheme;
}

////////////////////////////////////////////
//////////////////////  Setting
////////////////////////////////////////////

export enum ISettingsTabsType {
  applications = 'Applications',
  integrations = 'Integrations',
  properties = 'Properties',
  dashboard = 'Dashboard',
  jobs = 'Jobs',
}
