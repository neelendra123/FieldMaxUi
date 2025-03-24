import * as interfaces from './notifications.interfaces';

export const notificationsInitializeAction = (
  payload: interfaces.INotificationsInitializeActionPayload
): interfaces.IINotificationsInitializeAction => {
  return {
    type: interfaces.IActionTypes.NOTIFICATIONS_INITIALIZE,
    payload,
  };
};

export const notificationsUpdateAction = (
  payload: interfaces.INotificationsUpdateActionPayload
): interfaces.IINotificationsUpdateAction => {
  return {
    type: interfaces.IActionTypes.NOTIFICATIONS_UPDATE,
    payload,
  };
};
