import { Fragment, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { validateData } from '../../../utils/joi';
import { generateUniqueId } from '../../../utils/common';

import { TextInputComp } from '../../../components/Forms';

import JobPermissions from '../Common/JobPermissions';

import RolesDropdown from '../../Roles/Common/RolesDropdown';
import RolesSaveBtn from '../../Roles/Common/RolesSaveBtn';
import { IRoleKinds } from '../../Roles/interfaces';

import { IJobSubModulePerms } from '../../Orgs/interfaces';
// import { emailUniqueService } from '../../Users/services';

import * as interfaces from '../interfaces';
import * as constants from '../constants';

const DefaultFormData = {
  name: '',
  email: '',
};
export default function InviteMember({
  currentUser,

  paths,
  accountUsers,
  setAccountUsers,
  selectedUser,
}: {
  currentUser: {
    email: string;
  };

  paths: interfaces.IJobAddPaths;

  accountUsers: interfaces.IAddJobUser[];
  setAccountUsers: (accountUsers: interfaces.IAddJobUser[]) => void;

  selectedUser: interfaces.IAddJobUser;
}) {
  const history = useHistory();

  const [isFetching, setIsFetching] = useState(false);

  const [errors, setErrors] = useState({ ...DefaultFormData });

  const [user, setUser] = useState<interfaces.IAddJobUser>({
    ...selectedUser,
    uid: selectedUser.uid || generateUniqueId(),
    selected: true,
  });

  const setInviteEmailError = (msg: string) => {
    setErrors({
      ...DefaultFormData,
      email: msg,
    });
    // setIsFetching(false);
    return;
  };

  const onSave = async () => {
    const { name, email, uid } = user;

    const validate = validateData(
      { name, email },
      constants.AddEditInviteMemberJoiScheme
    );
    if (validate.errors) {
      setErrors(validate.errors);
      return;
    }

    // setIsFetching(true);
    setErrors({ ...DefaultFormData });

    const parsedEmail = validate.data.email;

    //  Adding Self Email as invite check
    if (parsedEmail === currentUser.email) {
      return setInviteEmailError(constants.Messages.inviteSelfErrorMsg);
    }

    //  Local User uid Check, if already added, if the respective uid is a invited user then we simply replace the previous user object with this new user.
    const userObjCache: Record<string, interfaces.IAddJobUser> = {};
    const usersIndexCache: Record<string, number> = {};
    accountUsers.forEach((accountUser, index) => {
      userObjCache[accountUser.uid] = accountUser;
      userObjCache[accountUser.email] = accountUser;

      usersIndexCache[accountUser.uid] = index;
      usersIndexCache[accountUser.email] = index;

      return accountUser.uid !== uid;
    });

    const newUsers = [...accountUsers];

    let index = -1;

    if (userObjCache[parsedEmail]?.id) {
      // If this email is already a account member of this organization then simply replacing permissions of that account member and selecting it
      index = usersIndexCache[userObjCache[parsedEmail].uid];

      newUsers[index] = {
        ...userObjCache[parsedEmail],
        email: parsedEmail,
        selected: true,
        skip: false,
        permissions: user.permissions,
      };
    } else {
      //  If this is a new invite and user is not an member of this account

      //  Already previously added this email or this uid
      if (usersIndexCache[user.uid]) {
        index = usersIndexCache[user.uid];
      } else if (usersIndexCache[parsedEmail]) {
        index = usersIndexCache[parsedEmail];
      } else {
        index = newUsers.length;
      }

      newUsers[index] = {
        ...user,
        email: parsedEmail,
        selected: true,
        skip: false,
        permissions: user.permissions,
      };
    }

    //  Api Email Validate Uniqueness of email in the current Org.
    // const emailCheck = await emailUniqueService(email);
    // if (!isMounted()) return;
    // if (!emailCheck) {
    //   setErrors({
    //     ...DefaultFormData,
    //     email: constants.Messages.inviteEmailAlreadyRegistered,
    //   });
    //   setIsFetching(false);
    //   return;
    // }
    setAccountUsers(newUsers);

    history.push(paths.details);
  };

  const onPermSave = (permissions: IJobSubModulePerms) => {
    const newUser = {
      ...user,
      permissions: {
        ...permissions,
      },
    };

    setUser(newUser);
  };

  const JobPermissionsCache = useCallback(() => {
    return (
      <JobPermissions permissions={user.permissions} onSave={onPermSave} />
    );
  }, [user]);

  return (
    <Fragment>
      <div className="main-heading-wrap flex-space-between-wrap mb-0 mb-md-4 py-2 pt-4">
        <div className="dashboard-heading-title">
          <h6 className="title">Invite Member</h6>
        </div>
        <div className="flex-content mobile-d-none">
          <div className="form-group select-group">
            <RolesDropdown onChange={onPermSave} />
          </div>

          <div className="btn-wrap mr-3">
            <RolesSaveBtn
              permissions={user.permissions}
              kind={IRoleKinds.jobRole}
            />
          </div>
          <div className="btn-wrap mr-3">
            <button
              className="btn btn-primary"
              onClick={onSave}
              disabled={isFetching}
            >
              Invite
            </button>
          </div>
          <div className="btn-wrap mr-3">
            <button
              className="btn btn-sm btn-warning"
              onClick={() => {
                history.push(paths.details);
              }}
              disabled={isFetching}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="user-profile-wrap">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-6">
            <div className="form-group">
              <TextInputComp
                name="name"
                onChange={(val, key) => {
                  setUser({
                    ...user,
                    name: val,
                  });
                }}
                label="New Member Name"
                autoFocus
                placeholder="New Member Name *"
                value={user.name}
                errorMsg={errors.name}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-6">
            <div className="form-group">
              <TextInputComp
                name="email"
                onChange={(val, key) => {
                  setUser({
                    ...user,
                    email: val,
                  });
                }}
                label="New Member Email"
                placeholder="New Member Email *"
                value={user.email}
                errorMsg={errors.email}
              />
            </div>
          </div>
        </div>
      </div>

      <JobPermissionsCache />
    </Fragment>
  );
}
