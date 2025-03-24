import { Fragment, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { validateData } from '../../../utils/joi';
import { successToast } from '../../../utils/toast';

import { TextInputComp } from '../../../components/Forms';

import { IJobSubModulePerms } from '../../Orgs/interfaces';
import { generateJobSubModulePerms } from '../../Orgs/utils';

import RolesDropdown from '../../Roles/Common/RolesDropdown';
import RolesSaveBtn from '../../Roles/Common/RolesSaveBtn';
import { IRoleKinds } from '../../Roles/interfaces';

import JobPermissions from '../Common/JobPermissions';

import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

const DefaultFormData = {
  name: '',
  email: '',
};
export default function InviteMember({
  jobId,

  currentUser,

  paths,

  fetchDataEffect,
}: {
  jobId: string;

  currentUser: {
    id: string;
    email: string;
  };

  paths: interfaces.IJobEditMembersPaths;

  fetchDataEffect: () => void;
}) {
  const isMounted = useMountedState();

  const history = useHistory();

  const [isFetching, setIsFetching] = useState(false);

  const [errors, setErrors] = useState({ ...DefaultFormData });

  const [data, setData] = useState<interfaces.IJobMemberInviteReqData>({
    name: '',
    email: '',
    permissions: generateJobSubModulePerms(),
  });

  const setInviteEmailError = (msg: string) => {
    if (!isMounted()) {
      return;
    }

    setErrors({
      ...DefaultFormData,
      email: msg,
    });
    setIsFetching(false);
    return;
  };

  const onSave = async () => {
    try {
      const validate = validateData(data, constants.InviteMemberJoiScheme);
      if (validate.errors) {
        setErrors(validate.errors);
        return;
      }

      setErrors({ ...DefaultFormData });
      setIsFetching(true);

      data.email = validate.data.email;

      //  Adding Self Email as invite check
      if (data.email === currentUser.email) {
        return setInviteEmailError(constants.Messages.inviteSelfErrorMsg);
      }

      let result = await services.jobMemberInviteService(jobId, data);
      if (!isMounted()) {
        return;
      }

      successToast(result.message);

      await fetchDataEffect();

      history.push(paths.base);
    } catch (error: any) {
      setInviteEmailError(error.response?.data?.message || error.message);
    }
  };

  const onPermSave = (permissions: IJobSubModulePerms) => {
    const newUser = {
      ...data,
      permissions: {
        ...permissions,
      },
    };

    setData(newUser);
  };

  const JobPermissionsCache = useCallback(() => {
    return (
      <JobPermissions permissions={data.permissions} onSave={onPermSave} />
    );
  }, [data]);

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
              permissions={data.permissions}
              kind={IRoleKinds.jobRole}
              disabled={isFetching}
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
                history.push(paths.base);
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
                  setData({
                    ...data,
                    name: val,
                  });
                }}
                label="New Member Name"
                autoFocus
                placeholder="New Member Name *"
                value={data.name}
                errorMsg={errors.name}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-6">
            <div className="form-group">
              <TextInputComp
                name="email"
                onChange={(val, key) => {
                  setData({
                    ...data,
                    email: val,
                  });
                }}
                label="New Member Email"
                placeholder="New Member Email *"
                value={data.email}
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
