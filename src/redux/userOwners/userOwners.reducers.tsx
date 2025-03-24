import * as interfaces from './userOwners.interfaces';

import { DefaultUserOwnerCreateEditBackup } from '../../pages/UserOwners/constants';

const DEFAULT_STATE: interfaces.IUserOwnerDefaultState = {
  // createBackup: localStorage.getItem('userOwnerCreateBackup')
  //   ? JSON.parse(localStorage.getItem('userOwnerCreateBackup') as string)
  //   : DefaultUserOwnerCreateBackup,
  createBackup: { ...DefaultUserOwnerCreateEditBackup },
  editBackup: { ...DefaultUserOwnerCreateEditBackup },
};

const reducer = (
  state = DEFAULT_STATE,
  action: interfaces.IUserOwnerActions
): interfaces.IUserOwnerDefaultState => {
  switch (action.type) {
    //  Create Owner Backup Data
    case interfaces.IActionTypes.USER_OWNER_CREATE_BACKUP_UPDATE: {
      const newBackup = {
        ...action.payload,
      };

      // localStorage.setItem('userOwnerCreateBackup', JSON.stringify(newBackup));

      return {
        ...state,
        createBackup: newBackup,
      };
    }

    //  Edit Owner Backup Data
    case interfaces.IActionTypes.USER_OWNER_EDIT_BACKUP_UPDATE: {
      const newEditOwnerBackup = {
        ...action.payload,
      };

      return {
        ...state,
        editBackup: newEditOwnerBackup,
      };
    }

    //  Reseting Owner Create Edit Backup
    case interfaces.IActionTypes.USER_OWNER_CREATE_EDIT_BACKUP_RESET: {
      return {
        ...state,
        createBackup: { ...DefaultUserOwnerCreateEditBackup },
        editBackup: { ...DefaultUserOwnerCreateEditBackup },
      };
    }

    default:
      return state;
  }
};

export default reducer;
