import { Fragment, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import JobPermissions from '../Common/JobPermissions';

import { IRoleKinds } from '../../Roles/interfaces';
import RolesDropdown from '../../Roles/Common/RolesDropdown';
import RolesSaveBtn from '../../Roles/Common/RolesSaveBtn';

import { IJobSubModulePerms } from '../../Orgs/interfaces';

import * as interfaces from '../interfaces';

export default function EditMember({
  paths,
  accountUsers,
  setAccountUsers,
  selectedUser,
  setSelectedUser,
}: {
  paths: interfaces.IJobAddPaths;

  accountUsers: interfaces.IAddJobUser[];
  setAccountUsers: (accountUsers: interfaces.IAddJobUser[]) => void;

  selectedUser: interfaces.IAddJobUser;
  setSelectedUser: (accountUsers: interfaces.IAddJobUser) => void;
}) {
  const history = useHistory();

  const [member, setMember] = useState<interfaces.IAddJobUser>({
    ...selectedUser,
  });

  const onSave = (permissions: IJobSubModulePerms, pageChange = false) => {
    const newMember: interfaces.IAddJobUser = {
      ...member,
      permissions,
      selected: true,
    };
    setMember(newMember);

    if (pageChange) {
      //  If Changing page, means saving then only updating the current member perm details
      const filteredUsers = accountUsers.filter(
        (jobUser) => jobUser.email !== member.email
      );
      const newAccountUsers = [...filteredUsers, newMember];
      setAccountUsers(newAccountUsers);

      setSelectedUser(newMember);

      history.push(paths.details);
    }
  };

  const JobPermissionsCache = useCallback(() => {
    return <JobPermissions permissions={member.permissions} onSave={onSave} />;
  }, [member]);

  return (
    <Fragment>
      <div className="main-heading-wrap flex-space-between-wrap mb-0 mb-md-4 py-2 pt-4">
        <div className="dashboard-heading-title">
          <h6 className="title">Edit Member Permissions - {member.name}</h6>
        </div>
        <div className="flex-content mobile-d-none">
          <div className="form-group select-group">
            <RolesDropdown onChange={onSave} />
          </div>
          <div className="btn-wrap mr-3">
            <RolesSaveBtn
              permissions={member.permissions}
              kind={IRoleKinds.jobRole}
            />
          </div>
          <div className="btn-wrap mr-3">
            <button
              className="btn btn-primary"
              onClick={() => onSave(member.permissions, true)}
            >
              Save Changes
            </button>
          </div>
          <div className="btn-wrap mr-3">
            <button
              className="btn btn-sm btn-warning"
              onClick={() => {
                history.push(paths.details);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <JobPermissionsCache />
    </Fragment>
  );
}
