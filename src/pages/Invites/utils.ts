import { IAuthUser } from '../Auth/interfaces';

import * as interfaces from './interfaces';

export const generateDefaultInvite = (
  status: interfaces.IInviteStatusKind = interfaces.IInviteStatusKind
    .savePending
): interfaces.IInvite => {
  const invite: interfaces.IInvite = {
    token: '',
    status,
  };

  return invite;
};

export const getInviteData = (
  user: IAuthUser,
  accountIndex: number
): interfaces.IParsedInvite | null => {
  const activeAccount = user.accounts[accountIndex];

  let invite = localStorage.getItem('invite');

  let parsedInvite: interfaces.IParsedInvite;

  if (invite) {
    //  This is incase user have an invite in the local storage, meaning user logged in using invite flow
    parsedInvite = JSON.parse(invite);

    if (!parsedInvite.token || !parsedInvite.data) {
      return null;
    }

    // let inviteAccountId: string =
    //   parsedInvite.data.jwtData.invitedPrimaryUserId;

    //  If current account is not equal to the invited account id then return null
    // if (inviteAccountId !== activeAccount.primaryUserId.id) {
    //   return null;
    // }

    return parsedInvite;
  }
  //  This is added in case user directly comes in to the dashboard and have an invite pending in the current active account
  if (!activeAccount.invite.token) {
    return null;
  }

  parsedInvite = {
    token: activeAccount.invite.token,
    data: {
      jwtData: {
        kind: interfaces.IInviteKind.userInvite,

        userId: user.id,
        primaryUserId: user.primaryUserId,
        creatorId: user.id,

        invitedPrimaryUserId: activeAccount.primaryUserId.id,

        email: user.email,
      },
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || '',
        newUser: false,
        id: user.id,
        primaryUserId: user.primaryUserId,
        account:{name: user.account? user.account?.name : user.firstName},
      },
    },
  };

  return parsedInvite;
};

export const clearInviteData = () => {
  localStorage.removeItem('invite');
};
