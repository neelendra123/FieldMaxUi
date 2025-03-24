import * as interfaces from './jobs.interfaces';

import { DefaultJob } from '../../pages/Jobs/constants';

const DEFAULT_STATE: interfaces.IJobDefaultState = {
  createBackup: { ...DefaultJob },
  editBackup: { ...DefaultJob },
};

const reducer = (
  state = DEFAULT_STATE,
  action: interfaces.IJobActions
): interfaces.IJobDefaultState => {
  switch (action.type) {
    case interfaces.IActionTypes.JOB_CREATE_BACKUP_UPDATE: {
      const newBackup = {
        ...action.payload,
      };

      return {
        ...state,
        createBackup: newBackup,
      };
    }

    case interfaces.IActionTypes.JOB_EDIT_BACKUP_UPDATE: {
      const newEditOwnerBackup = {
        ...action.payload,
      };

      return {
        ...state,
        editBackup: newEditOwnerBackup,
      };
    }

    case interfaces.IActionTypes.JOB_CREATE_EDIT_BACKUP_RESET: {
      return {
        ...state,
        createBackup: { ...DefaultJob },
        editBackup: { ...DefaultJob },
      };
    }

    default:
      return state;
  }
};

export default reducer;
