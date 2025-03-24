import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { validateData } from '../../../utils/joi';
import { successToast } from '../../../utils/toast';

import Main from '../../../components/Layouts/Main';
import { TextInputComp } from '../../../components/Forms';

import { IOrgPerms } from '../../Orgs/interfaces';
import { generateDefaultOrgPerms } from '../../Orgs/utils';

import UserPermissions from '../Common/UserPermissions';

import UserRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

const DefaultFormError = {
  firstName: '',
  lastName: '',
  email: '',
  permissions: '',
  pic: '',
};

export default function UserEdit() {
  const isMounted = useMountedState();

  const history = useHistory<any>();

  const params: { userId: string } = useParams();

  const [isFetching, setIsFetching] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<IOrgPerms>({
    ...generateDefaultOrgPerms(),
  });

  const [errors, setErrors] = useState(DefaultFormError);

  const fetchData = async () => {
    try {
      let user: interfaces.IUser =
        history.location?.state?.user ||
        (await services.userGetService(params.userId));
      if (!isMounted()) {
        return;
      }

      setFirstName(user.firstName);
      setLastName(user.lastName ?? '');
      setEmail(user.email);
      setPermissions(user.accounts[0].permissions);
    } catch (error) {}
  };

  const formSubmitted = async (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    const data: interfaces.IUserEditReqData = {
      permissions,
    };

    const validate = validateData(data, constants.UserEditValsScheme);
    let newErrors = {
      ...validate.errors,
    };
    if (Object.values(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsFetching(true);
    setErrors(DefaultFormError);

    //  Updating User
    try {
      const result = await services.userEditService(params.userId, data);
      if (!isMounted()) {
        return;
      }

      successToast(result.message);
      setIsFetching(false);
    } catch (error: any) {
      if (!isMounted()) {
        return;
      }

      if (error.response?.data?.data) {
        setErrors({
          ...DefaultFormError,
          ...error.response.data.data,
        });
      }

      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Main sideBarId={UserRoutes.routes.edit.sideBarId}>
      <div className="mx-4">
        <div className="main-heading-wrap flex-space-between ipad-flex-wrap mb-4">
          <div className="dashboard-heading-title d-flex ipad-w-100">
            <h5 className="title">Edit User</h5>
          </div>
          <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0">
            <div className="d-none d-md-flex">
              <button
                className="btn btn-primary"
                disabled={isFetching}
                onClick={formSubmitted}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-6">
            <div className="form-group ">
              <label htmlFor="firstname" className="d-none d-md-block">
                First Name
              </label>
              <TextInputComp
                name="firstName"
                id="firstname"
                onChange={setFirstName}
                placeholder="First Name *"
                value={firstName}
                errorMsg={errors.firstName}
                className="form-control form-control-sm"
                disabled
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label htmlFor="lastname" className="d-none d-md-block">
                Last Name
              </label>

              <TextInputComp
                name="lastName"
                id="lastName"
                onChange={setLastName}
                placeholder="Last Name"
                value={lastName}
                errorMsg={errors.lastName}
                className="form-control form-control-sm"
                disabled
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="lastname" className="d-none  d-md-block">
                Email
              </label>

              <TextInputComp
                name="email"
                id="email"
                onChange={setEmail}
                placeholder="Email *"
                value={email}
                errorMsg={errors.email}
                className="form-control form-control-sm"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="border-top my-2" />

        <UserPermissions
          setPermissions={setPermissions}
          permissions={permissions}
        />

        <div className="d-block d-sm-block d-md-none my-5">
          <button
            className="btn btn-primary w-100"
            disabled={isFetching}
            onClick={formSubmitted}
          >
            Save
          </button>
        </div>
      </div>
    </Main>
  );
}
