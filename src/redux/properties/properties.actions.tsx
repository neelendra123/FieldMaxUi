import * as interfaces from './properties.interfaces';

export const propertyCreateBackupUpdateAction = (
  payload: interfaces.IPropertyCreateBackupUpdateActionPayload
): interfaces.IPropertyCreateBackupUpdateAction => {
  return {
    type: interfaces.IActionTypes.PROPERTY_CREATE_BACKUP_UPDATE,
    payload,
  };
};

export const propertyEditBackupUpdateAction = (
  payload: interfaces.IPropertyEditBackupUpdateActionPayload
): interfaces.IPropertyEditBackupUpdateAction => {
  return {
    type: interfaces.IActionTypes.PROPERTY_EDIT_BACKUP_UPDATE,
    payload,
  };
};

export const propertyCreateEditBackupResetAction =
  (): interfaces.IPropertyCreateEditBackupResetAction => {
    return {
      type: interfaces.IActionTypes.PROPERTY_CREATE_EDIT_BACKUP_RESET,
    };
  };
