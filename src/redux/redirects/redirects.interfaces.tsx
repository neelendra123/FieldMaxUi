import { ICommonAddress, IModuleKind } from '../../interfaces';

export enum IActionTypes {
  REDIRECT_CREATE = 'REDIRECT_CREATE',
  PROPERTY_CREATE = 'PROPERTY_CREATE',
  PROPERTY_UNIT_CREATE = 'PROPERTY_UNIT_CREATE',
  USER_OWNER_CREATE = 'USER_OWNER_CREATE',
  REDIRECT_RESET = 'REDIRECT_RESET',
}

//  Redirecting to another path
export interface IRedirectActionPayload {
  redirectPath: string;
  kind:
    | IModuleKind.jobs
    | IModuleKind.properties
    | IModuleKind.userOwners
    | 'propertyUnits';
}
export interface IRedirectAction {
  type: IActionTypes.REDIRECT_CREATE;
  payload: IRedirectActionPayload;
}

//  Property Created & Redirect Update
export interface IRedirectPropertyCreateActionPayload {
  propertyId: string;
  propertyUnitId: string;
  address: ICommonAddress;
}
export interface IRedirectPropertyCreateAction {
  type: IActionTypes.PROPERTY_CREATE;
  payload: IRedirectPropertyCreateActionPayload;
}

//  Unit Created & Redirect Update
export interface IRedirectPropertyUnitCreateActionPayload {
  propertyId: string | null;
  propertyUnitId: string;
}
export interface IRedirectPropertyUnitCreateAction {
  type: IActionTypes.PROPERTY_UNIT_CREATE;
  payload: IRedirectPropertyUnitCreateActionPayload;
}

//  Unit Created & Redirect Update
export interface IRedirectUserOwnerCreateActionPayload {
  userOwnerId: string;
}
export interface IRedirectUserOwnerCreateAction {
  type: IActionTypes.USER_OWNER_CREATE;
  payload: IRedirectUserOwnerCreateActionPayload;
}

export interface IRedirectResetAction {
  type: IActionTypes.REDIRECT_RESET;
}

export type IRedirectActions =
  | IRedirectAction
  | IRedirectPropertyCreateAction
  | IRedirectPropertyUnitCreateAction
  | IRedirectUserOwnerCreateAction
  | IRedirectResetAction;

export interface IRedirectDefaultState {
  redirectPath: string | null;
  redirectCreated: {
    kind:
      | IModuleKind.userOwners
      | IModuleKind.properties
      | 'propertyUnits'
      | null;
    propertyId: string | null; //  This is used to get the created property
    propertyUnitId: string | null; //  This is used to get the created propertyUnit
    userOwnerId: string | null; //  This is used to get the created userOwner
    address: ICommonAddress; //  This is used to get the created address details
  };
}
