import { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { useMountedState } from 'react-use';

import { IAppReduxState } from '../../redux/reducer';
import {
  accountChangeAction,
  authUpdateAction,
} from '../../redux/auth/auth.actions';

import { successToast } from '../../utils/toast';

import { IAuthUser } from '../Auth/interfaces';

import { generateJobDetailsPath } from '../Jobs/utils';

import * as interfaces from './interfaces';
import * as utils from './utils';
import * as services from './services';

interface IInvite {
  token: string;
  data: interfaces.InviteDecodeJWTResData;
}
function InvitePopup() {
  const isMounted = useMountedState();

  const history = useHistory();

  const {
    auth: { accountIndex, authUser, auth },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

  //  This is for the invite popup
  const [invite, setInvite] = useState<interfaces.IParsedInvite | null>(null);

  const inviteUpdateEffect = (
    invite: interfaces.IParsedInvite,
    status:
      | interfaces.IInviteStatusKind.accepted
      | interfaces.IInviteStatusKind.rejected
  ) => {
    const dispatchUpdateUser = (newUser: IAuthUser) => {
      reduxActionDispatch(
        authUpdateAction({
          user: newUser,
          auth: {
            token: auth.token as string,
            // expiry: parseInt(auth.expiry as string),
          },
        })
      );
    };

    if (status === interfaces.IInviteStatusKind.accepted) {
      //  If type user invite and accepted then updating the status of invite to accepted, token to empty in the user active account index
      const newUser = { ...authUser };
      newUser.accounts[accountIndex].invite = {
        ...newUser.accounts[accountIndex].invite,
        status,
        token: '',
      };

      dispatchUpdateUser(newUser);

      if (invite.data.jwtData.kind === interfaces.IInviteKind.jobInvite) {
        //  If type job invite and accepted then redirect to the job details path
        const detailsPath = generateJobDetailsPath(invite.data.jwtData.jobId);

        history.push(detailsPath);
      }
    } else {
      if (invite.data.jwtData.kind === interfaces.IInviteKind.userInvite) {
        //  If type user invite and rejected then updating the accounts by removing the active index also changing the default active index

        //Removing rejected account
        const newUser = { ...authUser };
        newUser.accounts = newUser.accounts.filter(
          (account) =>
            account.primaryUserId.id !==
            invite.data.jwtData.invitedPrimaryUserId
        );

        //Changing the active index to 0 in redux
        reduxActionDispatch(
          accountChangeAction({
            accountIndex: 0,
          })
        );

        dispatchUpdateUser(newUser);
      }
    }
  };

  const invitePopup = async (invite: IInvite) => {
    let text = `Do you want to accept the invite for`;
    let title = 'Invite';

    if (invite.data.job?.title) {
      title = 'Job Invite';
      text = `${text} the Job: ${invite.data.job.title}`;
    } else if (invite.data.jwtData.kind === interfaces.IInviteKind.userInvite) {
      title = 'Account Invite';
      text = `${text} the account: ${authUser.accounts[accountIndex].primaryUserId.account.name}`;
    } else if (
      invite.data.jwtData.kind === interfaces.IInviteKind.userOwnerInvite
    ) {
      title = 'Owner Invite';
      text = `${text} the account: ${authUser.accounts[accountIndex].primaryUserId.account.name}`;
    }

    const confirm = await swal({
      title,
      text,
      closeOnEsc: false,
      closeOnClickOutside: false,
      buttons: {
        cancel: {
          text: 'Reject',
          visible: true,
        },
        accept: {
          text: 'Accept',
          visible: true,
        },
      },
      icon: 'info',
    });
    //  Rejecting the invite
    let status = confirm
      ? interfaces.IInviteStatusKind.accepted
      : interfaces.IInviteStatusKind.rejected;

    const result = await services.inviteStatusUpdateService({
      status,
      token: invite.token,
    });
    if (!isMounted()) {
      return;
    }
    successToast(result.message);

    utils.clearInviteData();

    inviteUpdateEffect(invite, status);
  };

  useEffect(() => {
    const newInvite = utils.getInviteData(authUser, accountIndex);

    setInvite(newInvite);

    if (newInvite) {
      invitePopup(newInvite);
    }
  }, [accountIndex]);

  return <Fragment></Fragment>;
}

export default InvitePopup;
