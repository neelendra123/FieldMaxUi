import { IModuleKind } from '../../interfaces';

import { DefaultCommonAddress } from '../../pages/Address/constants';

import * as interfaces from './redirects.interfaces';

const DEFAULT_STATE: interfaces.IRedirectDefaultState = {
  redirectPath: null,
  redirectCreated: {
    kind: null,
    propertyId: null,
    propertyUnitId: null,
    userOwnerId: null,
    address: DefaultCommonAddress,
  },
};

const reducer = (
  state = DEFAULT_STATE,
  action: interfaces.IRedirectActions
): interfaces.IRedirectDefaultState => {
  switch (action.type) {
    //  Redirected
    case interfaces.IActionTypes.REDIRECT_CREATE: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case interfaces.IActionTypes.USER_OWNER_CREATE: {
      return {
        ...state,
        redirectPath: '',
        redirectCreated: {
          ...DEFAULT_STATE.redirectCreated,
          ...action.payload,
          kind: IModuleKind.userOwners,
        },
      };
    }

    //  Property, Unit Created
    case interfaces.IActionTypes.PROPERTY_CREATE: {
      return {
        ...state,
        redirectPath: '',
        redirectCreated: {
          ...DEFAULT_STATE.redirectCreated,
          ...action.payload,
          kind: IModuleKind.properties,
        },
      };
    }
    case interfaces.IActionTypes.PROPERTY_UNIT_CREATE: {
      return {
        ...state,
        redirectPath: '',
        redirectCreated: {
          ...DEFAULT_STATE.redirectCreated,
          ...action.payload,
          kind: 'propertyUnits',
        },
      };
    }

    case interfaces.IActionTypes.REDIRECT_RESET: {
      return {
        ...DEFAULT_STATE,
      };
    }

    default:
      return state;
  }
};

export default reducer;
