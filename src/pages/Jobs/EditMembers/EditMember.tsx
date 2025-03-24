import { Fragment, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { successToast } from '../../../utils/toast';

import { IRoleKinds } from '../../Roles/interfaces';
import RolesDropdown from '../../Roles/Common/RolesDropdown';
import RolesSaveBtn from '../../Roles/Common/RolesSaveBtn';

import { IJobSubModulePerms } from '../../Orgs/interfaces';

import JobPermissions from '../Common/JobPermissions';

import * as interfaces from '../interfaces';
import * as services from '../services';

export default function EditMember({
  jobId,

  paths,

  selectedUser,

  fetchDataEffect,
}: {
  jobId: string;

  paths: interfaces.IJobEditMembersPaths;

  selectedUser: interfaces.IEditJobUser;

  fetchDataEffect: () => void;
}) {
  const isMounted = useMountedState();

  const history = useHistory();

  const [isFetching, setIsFetching] = useState(false);

  const [member, setMember] = useState<interfaces.IEditJobUser>({
    ...selectedUser,
  });

  useEffect(() => {
    if (!member.id) {
      return history.push(paths.base);
    }
  }, []);

  const onSave = async (
    permissions: IJobSubModulePerms,
    pageChange = false
  ) => {
    const newMember: interfaces.IEditJobUser = {
      ...member,
      permissions,
    };
    setMember(newMember);

    if (!pageChange) {
      return;
    }

    setIsFetching(true);

    // Changing page, means updating the member via api
    try {
      let result = await services.jobMemberEditService(jobId, {
        userId: member.id,
        permissions,
      });

      successToast(result.message);

      await fetchDataEffect();

      history.push(paths.base);
    } catch (error: any) {}

    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  const JobPermissionsCache = useCallback(() => {
    return <JobPermissions permissions={member.permissions} onSave={onSave} />;
  }, [member]);

  return (
    <Fragment>
      <div className="main-heading-wrap flex-space-between-wrap mb-0 mb-md-4 py-2">
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
              disabled={isFetching}
            />
          </div>
          <div className="btn-wrap mr-3">
            <button
              className="btn btn-primary"
              onClick={() => onSave(member.permissions, true)}
              disabled={isFetching}
            >
              Save Changes
            </button>
          </div>
          <div className="btn-wrap mr-3">
            <button
              className="btn btn-sm btn-warning"
              onClick={() => {
                history.push(history.location.pathname);
              }}
              disabled={isFetching}
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
