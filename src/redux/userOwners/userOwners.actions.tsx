import * as interfaces from './userOwners.interfaces';

export const userOwnerCreateBackupUpdateAction = (
  payload: interfaces.IUserOwnerCreateBackupUpdateActionPayload
): interfaces.IUserOwnerCreateBackupUpdateAction => {
  return {
    type: interfaces.IActionTypes.USER_OWNER_CREATE_BACKUP_UPDATE,
    payload,
  };
};

export const userOwnerEditBackupUpdateAction = (
  payload: interfaces.IUserOwnerEditBackupUpdateActionPayload
): interfaces.IUserOwnerEditBackupUpdateAction => {
  return {
    type: interfaces.IActionTypes.USER_OWNER_EDIT_BACKUP_UPDATE,
    payload,
  };
};

export const userOwnerCreateEditBackupResetAction =
  (): interfaces.IUserOwnerCreateEditBackupResetAction => {
    return {
      type: interfaces.IActionTypes.USER_OWNER_CREATE_EDIT_BACKUP_RESET,
    };
  };
