import * as interfaces from './auth.interfaces';

export const authUpdateAction = (
  payload: interfaces.IAuthUpdatePayload
): interfaces.IAuthUpdateAction => {
  return {
    type: interfaces.IActionTypes.AUTH_UPDATE,
    payload,
  };
};

export const profileUpdateAction = (
  payload: interfaces.IProfileUpdatePayload
): interfaces.IProfileUpdateAction => {
  return {
    type: interfaces.IActionTypes.PROFILE_UPDATE,
    payload,
  };
};

export const logoutAction = (): interfaces.ILogoutAction => {
  return {
    type: interfaces.IActionTypes.LOGOUT,
  };
};

export const accountChangeAction = (
  payload: interfaces.IAccountChangePayload
): interfaces.IAccountChangeAction => {
  return {
    type: interfaces.IActionTypes.ACCOUNT_CHANGE,
    payload,
  };
};
