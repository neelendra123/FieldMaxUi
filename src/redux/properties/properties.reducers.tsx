import * as interfaces from './properties.interfaces';

import { DefaultPropertyCreateEditBackup } from '../../pages/Properties/constants';

const DEFAULT_STATE: interfaces.IPropertyDefaultState = {
  // createBackup: localStorage.getItem('PropertyCreateBackup')
  //   ? JSON.parse(localStorage.getItem('PropertyCreateBackup') as string)
  //   : DefaultPropertyCreateBackup,
  createBackup: { ...DefaultPropertyCreateEditBackup },
  editBackup: { ...DefaultPropertyCreateEditBackup },
};

const reducer = (
  state = DEFAULT_STATE,
  action: interfaces.IPropertyActions
): interfaces.IPropertyDefaultState => {
  switch (action.type) {
    //  Create Owner Backup Data
    case interfaces.IActionTypes.PROPERTY_CREATE_BACKUP_UPDATE: {
      const newBackup = {
        ...action.payload,
      };

      // localStorage.setItem('PropertyCreateBackup', JSON.stringify(newBackup));

      return {
        ...state,
        createBackup: newBackup,
      };
    }

    //  Edit Owner Backup Data
    case interfaces.IActionTypes.PROPERTY_EDIT_BACKUP_UPDATE: {
      const newEditOwnerBackup = {
        ...action.payload,
      };

      return {
        ...state,
        editBackup: newEditOwnerBackup,
      };
    }

    //  Reseting Owner Create Edit Backup
    case interfaces.IActionTypes.PROPERTY_CREATE_EDIT_BACKUP_RESET: {
      return {
        ...state,
        createBackup: { ...DefaultPropertyCreateEditBackup },
        editBackup: { ...DefaultPropertyCreateEditBackup },
      };
    }

    default:
      return state;
  }
};

export default reducer;
