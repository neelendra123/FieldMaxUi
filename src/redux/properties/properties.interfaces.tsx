import { IPropertyCreateEditBackup } from '../../pages/Properties/interfaces';

export enum IActionTypes {
  PROPERTY_CREATE_BACKUP_UPDATE = 'PROPERTY_CREATE_BACKUP_UPDATE',
  PROPERTY_EDIT_BACKUP_UPDATE = 'PROPERTY_EDIT_BACKUP_UPDATE',
  PROPERTY_CREATE_EDIT_BACKUP_RESET = 'PROPERTY__CREATE_EDIT_BACKUP_RESET',
}

//  Creating Backup Update
export interface IPropertyCreateBackupUpdateActionPayload
  extends IPropertyCreateEditBackup {}
export interface IPropertyCreateBackupUpdateAction {
  type: IActionTypes.PROPERTY_CREATE_BACKUP_UPDATE;
  payload: IPropertyCreateBackupUpdateActionPayload;
}

//  Edit Owner Backup
export interface IPropertyEditBackupUpdateActionPayload
  extends IPropertyCreateEditBackup {}
export interface IPropertyEditBackupUpdateAction {
  type: IActionTypes.PROPERTY_EDIT_BACKUP_UPDATE;
  payload: IPropertyEditBackupUpdateActionPayload;
}

//  Reseting Edit Owner Backup
export interface IPropertyCreateEditBackupResetAction {
  type: IActionTypes.PROPERTY_CREATE_EDIT_BACKUP_RESET;
}

export type IPropertyActions =
  | IPropertyCreateBackupUpdateAction
  | IPropertyEditBackupUpdateAction
  | IPropertyCreateEditBackupResetAction;

export interface IPropertyDefaultState {
  createBackup: IPropertyCreateEditBackup;
  editBackup: IPropertyCreateEditBackup;
}
