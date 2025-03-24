import { DefaultUserPic } from '../Users/constants';
import { DefaultAccountPic } from '../Accounts/constants';

import * as interfaces from './interfaces';

export const formatAuthUser = (user: interfaces.IAuthUser) => {
  user.picURL = user.picURL || DefaultUserPic;
  user.lastName = user.lastName || '';
  user.name = `${user.firstName} ${user.lastName}`;

  user.accounts = user.accounts.map((account) => {
    account.primaryUserId.account.logoURL =
      account.primaryUserId.account.logoURL || DefaultAccountPic;

    return account;
  });

  return user;
};
