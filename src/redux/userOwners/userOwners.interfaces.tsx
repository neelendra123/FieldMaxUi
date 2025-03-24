import { IUserOwnerCreateEditBackup } from '../../pages/UserOwners/interfaces';

export enum IActionTypes {
  USER_OWNER_CREATE_BACKUP_UPDATE = 'USER_OWNER_CREATE_BACKUP_UPDATE',
  USER_OWNER_EDIT_BACKUP_UPDATE = 'USER_OWNER_EDIT_BACKUP_UPDATE',
  USER_OWNER_CREATE_EDIT_BACKUP_RESET = 'USER_OWNER__CREATE_EDIT_BACKUP_RESET',
}

//  Creating Backup Update
export interface IUserOwnerCreateBackupUpdateActionPayload
  extends IUserOwnerCreateEditBackup {}
export interface IUserOwnerCreateBackupUpdateAction {
  type: IActionTypes.USER_OWNER_CREATE_BACKUP_UPDATE;
  payload: IUserOwnerCreateBackupUpdateActionPayload;
}

//  Edit Owner Backup
export interface IUserOwnerEditBackupUpdateActionPayload
  extends IUserOwnerCreateEditBackup {}
export interface IUserOwnerEditBackupUpdateAction {
  type: IActionTypes.USER_OWNER_EDIT_BACKUP_UPDATE;
  payload: IUserOwnerEditBackupUpdateActionPayload;
}

//  Reseting Edit Owner Backup
export interface IUserOwnerCreateEditBackupResetAction {
  type: IActionTypes.USER_OWNER_CREATE_EDIT_BACKUP_RESET;
}

export type IUserOwnerActions =
  | IUserOwnerCreateBackupUpdateAction
  | IUserOwnerEditBackupUpdateAction
  | IUserOwnerCreateEditBackupResetAction;

export interface IUserOwnerDefaultState {
  createBackup: IUserOwnerCreateEditBackup;
  editBackup: IUserOwnerCreateEditBackup;
}
