import {
  getAuthToken,
  getAuthUser,
  getProductDetails,
} from '../../utils/common';

import { DefaultUser } from '../../pages/Auth/constants';

import { generateOrgParsedPerms } from '../../pages/Orgs/utils';

import { getUserTypes } from '../../pages/Users/utils';

import * as interfaces from './auth.interfaces';

const DEFAULT_STATE: interfaces.IDefaultState = {
  auth: {
    token: getAuthToken(),
    // expiry: getAuthExpiry(),
  },

  authUser: getAuthUser() || DefaultUser,
  accountsPermissions: getAuthUser().accounts.map((account) =>
    generateOrgParsedPerms(undefined, account.userType, account.permissions)
  ),
  accountsUserTypes: [
    {
      isSuperAdmin: false,
      isAdmin: false,
      isOwner: false,
    },
  ],

  accountIndex: parseInt(localStorage.getItem('accountIndex') ?? '0'),

  product: getProductDetails(),
};

const reducer = (
  state = DEFAULT_STATE,
  action: interfaces.IAuthActions
): interfaces.IDefaultState => {
  switch (action.type) {
    case interfaces.IActionTypes.AUTH_UPDATE: {
      localStorage.setItem('authToken', action.payload.auth.token);
      // if (action.payload.auth?.expiry) {
      //   const now = new Date();
      //   const authExpiry = now.getTime() + action.payload.auth.expiry * 1000;

      //   localStorage.setItem('authExpiry', `${authExpiry}`);
      // }

      const user = action.payload.user;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accountIndex', `${state.accountIndex}`); //Todo Add this option to select dynamically

      const accountsPermissions = user.accounts.map((account) =>
        generateOrgParsedPerms(
          user.userType,
          account.userType,
          account.permissions
        )
      );

      const accountsUserTypes = user.accounts.map((account) =>
        getUserTypes(user.userType, account.userType)
      );

      const authUser = action.payload.user;

      return {
        ...state,
        auth: {
          token: action.payload.auth.token,
          // expiry: `${action.payload.auth.expiry}`,
        },
        authUser,
        accountsPermissions,
        accountsUserTypes,
      };
    }

    case interfaces.IActionTypes.PROFILE_UPDATE: {
      const authUser = { ...action.payload.user };

      localStorage.setItem('user', JSON.stringify(authUser));

      return {
        ...state,
        authUser,
      };
    }

    // case interfaces.ActionTypes.ACCOUNT_UPDATE: {
    //   const { account, accountIndex } = action.payload;

    //   const newAuthUser = { ...state.user };

    //   newAuthUser.accounts[accountIndex].primaryUserId = account;

    //   localStorage.setItem('user', JSON.stringify(newAuthUser));

    //   return {
    //     ...state,
    //     user: newAuthUser,
    //   };
    // }

    case interfaces.IActionTypes.ACCOUNT_CHANGE: {
      const { accountIndex } = action.payload;

      localStorage.setItem('accountIndex', `${accountIndex}`);

      return {
        ...state,
        accountIndex,
      };
    }

    case interfaces.IActionTypes.LOGOUT: {
      localStorage.clear();

      return {
        ...DEFAULT_STATE,
        auth: {
          token: '',
          // expiry: null,
        },

        authUser: DefaultUser,

        accountIndex: 0,
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
