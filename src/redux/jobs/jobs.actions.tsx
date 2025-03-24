import * as interfaces from './jobs.interfaces';

export const jobCreateBackupUpdateAction = (
  payload: interfaces.IJobCreateBackupUpdateActionPayload
): interfaces.IJobCreateBackupUpdateAction => {
  return {
    type: interfaces.IActionTypes.JOB_CREATE_BACKUP_UPDATE,
    payload,
  };
};

export const jobEditBackupUpdateAction = (
  payload: interfaces.IJobEditBackupUpdateActionPayload
): interfaces.IJobEditBackupUpdateAction => {
  return {
    type: interfaces.IActionTypes.JOB_EDIT_BACKUP_UPDATE,
    payload,
  };
};

export const jobCreateEditBackupResetAction =
  (): interfaces.IJobCreateEditBackupResetAction => {
    return {
      type: interfaces.IActionTypes.JOB_CREATE_EDIT_BACKUP_RESET,
    };
  };
