import { INotificationListData } from '../../pages/Notifications/interfaces';

export enum IActionTypes {
  NOTIFICATIONS_INITIALIZE = 'NOTIFICATIONS_INITIALIZE',
  NOTIFICATIONS_UPDATE = 'NOTIFICATIONS_UPDATE',
}

//  When Notifications List is updated
export interface INotificationsInitializeActionPayload {
  accountsLength: number;
}
export interface IINotificationsInitializeAction {
  type: IActionTypes.NOTIFICATIONS_INITIALIZE;
  payload: INotificationsInitializeActionPayload;
}

//  When Notifications List is updated
export interface INotificationsUpdateActionPayload {
  accountIndex: number;
  notificationData: INotificationListData;
}
export interface IINotificationsUpdateAction {
  type: IActionTypes.NOTIFICATIONS_UPDATE;
  payload: INotificationsUpdateActionPayload;
}

export type INotificationActions =
  | IINotificationsInitializeAction
  | IINotificationsUpdateAction;

export interface INotificationDefaultState {
  notifications: INotificationListData[];
}
