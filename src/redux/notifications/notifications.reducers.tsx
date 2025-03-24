import { INotificationListData } from '../../pages/Notifications/interfaces';

import * as interfaces from './notifications.interfaces';

const DEFAULT_STATE: interfaces.INotificationDefaultState = {
  notifications: [],
};

const reducer = (
  state = DEFAULT_STATE,
  action: interfaces.INotificationActions
): interfaces.INotificationDefaultState => {
  switch (action.type) {
    //  Intitializing the Notifications array based on auth user accounts size
    case interfaces.IActionTypes.NOTIFICATIONS_INITIALIZE: {
      const { accountsLength } = action.payload;

      const notifications: INotificationListData[] = [];
      for (let i = 0; i < accountsLength; i++) {
        notifications.push({
          count: 0,
          unreadCount: 0,
          records: [],
        });
      }

      return {
        ...state,
        notifications,
      };
    }

    //  Updating the Notifications of a account
    case interfaces.IActionTypes.NOTIFICATIONS_UPDATE: {
      const { accountIndex, notificationData } = action.payload;

      const newState = {
        ...state,
      };
      newState.notifications[accountIndex] = notificationData;

      return {
        ...state,
        ...newState,
      };
    }

    default:
      return state;
  }
};

export default reducer;
