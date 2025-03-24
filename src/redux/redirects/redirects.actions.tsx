import * as interfaces from './redirects.interfaces';

export const redirectAction = (
  payload: interfaces.IRedirectActionPayload
): interfaces.IRedirectAction => {
  return {
    type: interfaces.IActionTypes.REDIRECT_CREATE,
    payload,
  };
};

export const redirectPropertyCreateAction = (
  payload: interfaces.IRedirectPropertyCreateActionPayload
): interfaces.IRedirectPropertyCreateAction => {
  return {
    type: interfaces.IActionTypes.PROPERTY_CREATE,
    payload,
  };
};

export const redirectPropertyUnitCreateAction = (
  payload: interfaces.IRedirectPropertyUnitCreateActionPayload
): interfaces.IRedirectPropertyUnitCreateAction => {
  return {
    type: interfaces.IActionTypes.PROPERTY_UNIT_CREATE,
    payload,
  };
};

export const redirectUserOwnerCreateAction = (
  payload: interfaces.IRedirectUserOwnerCreateActionPayload
): interfaces.IRedirectUserOwnerCreateAction => {
  return {
    type: interfaces.IActionTypes.USER_OWNER_CREATE,
    payload,
  };
};

export const redirectResetAction = (): interfaces.IRedirectResetAction => {
  return {
    type: interfaces.IActionTypes.REDIRECT_RESET,
  };
};
