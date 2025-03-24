import { useState, Fragment, useEffect } from 'react';
import { useMountedState } from 'react-use';
import swal from 'sweetalert';
import { toast } from 'react-toastify';

import { BiLogInCircle } from 'react-icons/bi';
import { AiOutlineSync } from 'react-icons/ai';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import { clearAllToast, successToast } from '../../../utils/toast';
import { validateData } from '../../../utils/joi';

import { TextInputComp } from '../../../components/Forms';

import * as interfaces from '../interfaces';
import * as services from '../services';
import * as constants from '../constants';

const DefaultFormError = {
  dbId: '',
  username: '',
  password: '',
};

interface RentManagerAccountSettingsProps {
  rentManager: interfaces.IRMIntegration;

  updateEffect: (rentManager: interfaces.IRMIntegration) => void;
}

export default function RentManagerAccountSetting({
  rentManager,

  updateEffect,
}: RentManagerAccountSettingsProps) {
  const isMounted = useMountedState();

  const [errors, setErrors] = useState({ ...DefaultFormError });

  const [isLoaded, setIsLoaded] = useState(true);

  const [dbId, setDbId] = useState(rentManager.dbId);
  const [username, setUsername] = useState(rentManager.username);
  const [password, setPassword] = useState('');

  const [showRentManagerLocations, setShowRentManagerLocations] =
    useState(true);

  //  Updating Credentials Flow
  const rmCredentialsUpdate = async (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    const formData: interfaces.IRMCredentialsUpdateReqData = {
      dbId,
      username,
      password,
    };

    const validate = validateData(
      formData,
      constants.RMCredentialsUpdateJoiSchema
    );
    if (validate.errors) {
      setErrors(validate.errors);
      return;
    }
    setErrors({ ...DefaultFormError });
    setIsLoaded(false);

    try {
      const result = await services.rmCredentialsUpdateService(formData);

      successToast(result.message);

      if (!isMounted()) {
        return;
      }

      updateEffect(result.data.integrations.rm);
    } catch (error: any) {}

    if (!isMounted()) {
      return;
    }
    setIsLoaded(true);
  };

  const rmDefaultLocationUpdate = async (locationId: number) => {
    const updateSwal = await swal({
      title: 'Are you sure?',
      text: 'Once updated, data will start syncing for this Rent Manager location!',
      icon: 'warning',
      dangerMode: true,
    });
    if (!updateSwal) {
      return;
    }

    setIsLoaded(false);

    const toastId = toast.loading(`Location is updating`, {
      autoClose: 1500,
    });

    try {
      const result = await services.rmDefaultLocationUpdate(locationId);
      if (!isMounted()) {
        return;
      }

      updateEffect(result.data.integrations.rm);

      toast.update(toastId, {
        render: `Default location is updated 👌`,
        type: 'success',
        isLoading: false,
        autoClose: 1500,
      });
    } catch (error) {
      clearAllToast();
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsLoaded(true);
  };

  const rmDisableSync = async () => {
    const deleteConfirm = await swal({
      title: 'Are you sure?',
      text: 'Once deleted, data will stop syncing from Rent Manager!',
      icon: 'warning',
      dangerMode: true,
    });
    if (!deleteConfirm) {
      return;
    }

    setIsLoaded(false);

    const toastId = toast.loading(`Disabling Syncing`, {
      autoClose: 1500,
    });

    try {
      const result = await services.rmDisableSync();
      if (!isMounted()) {
        return;
      }

      updateEffect(result.data.integrations.rm);

      toast.update(toastId, {
        render: `Syncing disabled 👌`,
        type: 'success',
        isLoading: false,
        autoClose: 1500,
      });
    } catch (error) {
      clearAllToast();
      console.error(error);
    }
    if (!isMounted()) {
      return;
    }

    setIsLoaded(true);
  };

  const rmSync = async () => {
    const deleteConfirm = await swal({
      title: 'Are you sure?',
      text: 'You want the data to resynced from the Rent Manager!',
      icon: 'warning',
      dangerMode: true,
    });
    if (!deleteConfirm) {
      return;
    }

    setIsLoaded(false);

    try {
      const result = await services.rmSync();
      if (!isMounted()) {
        return;
      }

      successToast(result.message);
    } catch (error) {
      clearAllToast();
      console.error(error);
    }
    if (!isMounted()) {
      return;
    }

    setIsLoaded(true);
  };

  useEffect(() => {
    setDbId(rentManager.dbId);
    setUsername(rentManager.username);
    setPassword('');
  }, [rentManager]);

  return (
    <div className="card mt-5 rounded equal-shadow">
      <div className="card-body bg-white">
        {/* <h6 className="fz-18">RENT MANAGER</h6> */}
        <div className="mb-3 mt-0">
          <img
            src={require('../../../assets/images/RMPS.png').default}
            alt="Rent Manager"
            title="Rent Manager"
          />
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="row">
            <div className="col-md-3 mt-3">
              <TextInputComp
                className="form-control form-control-sm"
                label="DbId *"
                id="dbId"
                name="dbId"
                placeholder="DbId *"
                onChange={setDbId}
                value={dbId}
                autoFocus
                errorMsg={errors.dbId}
              />
            </div>

            <div className="col-lg-3 col-md-4 mt-3">
              <TextInputComp
                className="form-control form-control-sm"
                label="UserName *"
                id="username"
                name="username"
                placeholder="Username *"
                onChange={setUsername}
                value={username}
                errorMsg={errors.username}
              />
            </div>

            <div className="col-lg-3 col-md-4 mt-3">
              <TextInputComp
                className="form-control form-control-sm"
                label="Password *"
                id="password"
                name="password"
                placeholder="Password *"
                onChange={setPassword}
                value={password}
                errorMsg={errors.password}
              />
            </div>

            <div className="col-lg-3 col-md-6 mt-3 d-flex align-items-end justify-content-md-start">
              <button
                className="btn btn-primary mr-3 px-2"
                disabled={!isLoaded}
                onClick={rmCredentialsUpdate}
              >
                <BiLogInCircle /> Update
              </button>
              <button
                className="btn btn-primary px-2"
                disabled={!rentManager.isActive || !isLoaded}
                onClick={rmDisableSync}
              >
                <AiOutlineSync className="mr-2" /> Disable Sync
              </button>
            </div>
            <button
              className="btn btn-success"
              disabled={!rentManager.isActive || !isLoaded}
              onClick={rmSync}
            >
              <AiOutlineSync className="mr-2" /> ReSync
            </button>
          </div>
        </form>

        <div className="d-flex justify-content-between align-items-center my-3">
          <h6 className="fz-18 mb-0">Locations</h6>
          <div
            onClick={() => {
              setShowRentManagerLocations(!showRentManagerLocations);
            }}
          >
            <div className="light-icon">
              {showRentManagerLocations ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>

        {showRentManagerLocations && (
          <Fragment>
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <tr>
                    <th className="font-weight-bold">#</th>
                    <th className="font-weight-bold">Name</th>
                    <th className="font-weight-bold">Friendly Name</th>
                    <th className="font-weight-bold">Action</th>
                  </tr>

                  {rentManager.locations.map((rmLocation, index) => {
                    return (
                      <tr key={index}>
                        <td scope="row">{index + 1}</td>
                        <td>{rmLocation.name}</td>
                        <td>{rmLocation.friendlyName}</td>
                        <td className="p-2">
                          {rmLocation.isMainLocation ? (
                            <div>Default Selected</div>
                          ) : (
                            <div>
                              <button
                                className="btn btn-primary"
                                disabled={!isLoaded}
                                onClick={() => {
                                  rmDefaultLocationUpdate(
                                    rmLocation.LocationID
                                  );
                                }}
                              >
                                Set as default
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
