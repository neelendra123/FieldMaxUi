import { IJobPopulated } from '../../pages/Jobs/interfaces';

export enum IActionTypes {
  JOB_CREATE_BACKUP_UPDATE = 'JOB_CREATE_BACKUP_UPDATE',
  JOB_EDIT_BACKUP_UPDATE = 'JOB_EDIT_BACKUP_UPDATE',
  JOB_CREATE_EDIT_BACKUP_RESET = 'JOB__CREATE_EDIT_BACKUP_RESET',
}

//  Creating Backup Update
export interface IJobCreateBackupUpdateActionPayload extends IJobPopulated {}
export interface IJobCreateBackupUpdateAction {
  type: IActionTypes.JOB_CREATE_BACKUP_UPDATE;
  payload: IJobCreateBackupUpdateActionPayload;
}

//  Edit Owner Backup
export interface IJobEditBackupUpdateActionPayload extends IJobPopulated {}
export interface IJobEditBackupUpdateAction {
  type: IActionTypes.JOB_EDIT_BACKUP_UPDATE;
  payload: IJobEditBackupUpdateActionPayload;
}

//  Reseting Edit Owner Backup
export interface IJobCreateEditBackupResetAction {
  type: IActionTypes.JOB_CREATE_EDIT_BACKUP_RESET;
}

export type IJobActions =
  | IJobCreateBackupUpdateAction
  | IJobEditBackupUpdateAction
  | IJobCreateEditBackupResetAction;

export interface IJobDefaultState {
  createBackup: IJobPopulated;
  editBackup: IJobPopulated;
}
