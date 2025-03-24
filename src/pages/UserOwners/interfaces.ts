import {
  ICommonAddress,
  ICommonListingParams,
  ICommonMediaUpload,
  ICommonResponse,
  IOption,
} from '../../interfaces';

import {
  ICommonAccess,
  ICommonEmail,
  ICommonPhoneNumber,
} from '../Common/interfaces';

import { IInvite } from '../Invites/interfaces';
import { INotePopulated } from '../Notes/interfaces';
import { IPropertyListAll } from '../Properties/interfaces';

//////////////////////////
//  Model Level
//////////////////////////
export interface IUserOwnerRMIntegrations {
  enabled: boolean;

  displayName: string;

  OwnerID: number;
  LocationID: number;
  updatedAt: Date | null;
}

export interface IUserOwnerProperty {
  propertyId: string;
  propertyUnits: string[];
}

export interface IUserOwner {
  id: string;

  primaryUserId: string; // Parent Org Id
  creatorId: string;

  userId: string; //  Parent User Id

  firstName: string;
  lastName: string;

  email: string;

  pic?: string;
  picURL?: string;

  taxId: string;

  comments: string;

  invite?: IInvite;

  emails: ICommonEmail[];

  phoneNumbers: ICommonPhoneNumber[];

  primaryAddress: ICommonAddress;
  billingAddress: ICommonAddress;
  addresses: ICommonAddress[];

  properties: IUserOwnerProperty[];

  access: ICommonAccess;

  rm: IUserOwnerRMIntegrations;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

//  Listings All
export interface IUserOwnerListAllRes {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  pic?: string;
  picURL?: string;
  userType: number;
}
export interface IUserOwnerListAllResData extends ICommonResponse {
  data: {
    records: IUserOwnerListAllRes[];
  };
}

//  Listing
export interface IUserOwnersListReqData extends ICommonListingParams {}
export interface IUserOwnersListResData extends ICommonResponse {
  data: {
    count: number;
    records: IUserOwner[];
  };
}

//  Creating
export enum IOwnerCreateUpdateTabsType {
  generalInfo = 'generalInfo',
  properties = 'properties',
  notes = 'notes',
  access = 'access',
  integrations = 'integrations',
  timeLine = 'timeLine',
}

export interface IUserOwnerCreateEditBackup {
  activeTab: IOwnerCreateUpdateTabsType;

  id: string;

  pic: ICommonMediaUpload;
  firstName: string;
  lastName: string;
  email: string;
  taxId: string;
  comments: string;
  //  Tab General Info
  emails: ICommonEmail[];
  phoneNumbers: ICommonPhoneNumber[];
  addresses: ICommonAddress[];
  //  Tab Properties

  properties: IUserOwnerProperty[];
  //  Tab Notes & History
  notes: INotePopulated[];
  //  Tab Access
  access: ICommonAccess;
  //  Tab Integrations
  rm: IUserOwnerRMIntegrations;
}

export interface IUserOwnerCreateReqData
  extends Omit<
    IUserOwnerCreateEditBackup,
    'id' | 'activeTab' | 'pic' | 'notes' | 'rm'
  > {
  pic?: string;

  notes: string[];

  primaryAddress: ICommonAddress;
  billingAddress: ICommonAddress;
  addresses: ICommonAddress[];

  rm: Omit<IUserOwnerRMIntegrations, 'OwnerID' | 'LocationID' | 'updatedAt'>;

  sendInvite?: boolean;
}

//  Edit Details
export interface IUserOwnerEditReqData {
  pic?: string;
  firstName: string;
  lastName: string;
  taxId: string;
  comments: string;
  //  Tab General Info
  emails?: ICommonEmail[];
  phoneNumbers?: ICommonPhoneNumber[];
  primaryAddress?: ICommonAddress;
  billingAddress?: ICommonAddress;
  addresses?: ICommonAddress[];
  //  Tab Properties
  properties?: IUserOwnerProperty[];
  //  Tab Access
  access?: ICommonAccess;
  //  Tab Integrations
  rm?: Omit<IUserOwnerRMIntegrations, 'OwnerID' | 'LocationID' | 'updatedAt'>;
}

// export interface UserOwnerEditReqData
//   extends Omit<
//     UserOwnerCreateEditBackup,
//     'id' | 'activeTab' | 'pic' | 'notes' | 'rm'
//   > {
//   pic?: string;

//   primaryAddress: CommonAddress;
//   billingAddress: CommonAddress;
//   addresses: CommonAddress[];

//   rm: Omit<IUserOwnerRMIntegrations, 'OwnerID' | 'LocationID' | 'updatedAt'>;
// }

export interface IUserOwnerPropertiesListAll extends IPropertyListAll, IOption {
  isSelected: boolean;
  selectedUnits: string[];
  showUnits: boolean;
}

export interface IUserOwnersCommonResData extends ICommonResponse {
  data: {
    record: IUserOwner;
  };
}

export interface IUserOwnerPopulated {
  firstName: string;
  lastName?: string;
  email: string;
  id: string;
  // pic?: string;
  picURL?: string;
}
