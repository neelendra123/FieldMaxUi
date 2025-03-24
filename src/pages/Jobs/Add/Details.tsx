import { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { validateData } from '../../../utils/joi';

import { TextInputComp } from '../../../components/Forms';
import { DtRangeFilters } from '../../../components/Common';
import { PolyfillAddIcon } from '../../../components/Icons';

import { DefaultUserPic } from '../../Users/constants';

import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as utils from '../utils';
import * as services from '../services';

export default function Details({
  paths,
  job,
  setJob,
  accountUsers,
  setAccountUsers,
  setSelectedUser,
}: {
  paths: interfaces.IJobAddPaths;

  job: interfaces.IJobPopulated;
  setJob: (job: interfaces.IJobPopulated) => void;

  accountUsers: interfaces.IAddJobUser[];
  setAccountUsers: (accountUsers: interfaces.IAddJobUser[]) => void;

  setSelectedUser: (accountUsers: interfaces.IAddJobUser) => void;
}) {
  const isMounted = useMountedState();

  const history = useHistory();

  const [isFetching, setIsFetching] = useState(false);

  //  This is the filtered users from account users on this page
  const [users, setUsers] = useState<interfaces.IAddJobUser[]>(accountUsers);

  //  Filters on Users Listing
  const [searchFilter, setSearchFilter] = useState('');
  const [sortOrder, setSortOrder] =
    useState<interfaces.IAddEditMembersSortFilter>({ name: 1, email: 1 });

  //  For Filtering and Sorting Job Members Listing
  useEffect(() => {
    const { filteredMembers } = utils.filterJobMembers(
      searchFilter,
      sortOrder,
      accountUsers
    );

    setUsers(filteredMembers as interfaces.IAddJobUser[]);
  }, [accountUsers, searchFilter, sortOrder]);

  const [errors, setErrors] = useState({
    ...constants.AddEditDetailsDefaultErrors,
  });

  const addressUpdate = (
    value: string,
    key: 'formatted' | 'city' | 'state'
  ) => {
    const address = {
      ...job.address,
      [key]: value,
    };

    setJob({
      ...job,
      address,
    });
  };

  const formSubmit = async (event: React.ChangeEvent<any>) => {
    try {
      let data: interfaces.IJobAddReqData = {
        propertyId: job.propertyId,
        propertyUnitId: job.propertyUnitId,
        title: job.title,
        startDt: job.startDt,
        endDt: job.endDt,
        address: job.address,
        users: [],
      };

      //  Filtering only those users who are selected at the moment
      const newJobUsers: interfaces.IAddEditJobUserReqData[] = [];
      accountUsers.forEach((user) => {
        if (user.selected) {
          newJobUsers.push({
            name: user.name,
            email: user.email,
            permissions: user.permissions,
          });
        }
      });
      data.users = newJobUsers;

      const validate = validateData(data, constants.AddJobJoiScheme);
      if (validate.errors) {
        return setErrors(validate.errors);
      }
      setErrors({ ...constants.AddEditDetailsDefaultErrors });
      setIsFetching(true);

      const result = await services.jobCreateService(data);
      if (!isMounted()) {
        return;
      }

      history.push(utils.generateJobDetailsPath(result.data.job.id), {
        successMsg: result.message,
      });
    } catch (error: any) {
      if (!isMounted()) {
        return;
      }

      if (error.response?.data?.data) {
        setErrors({
          ...constants.AddEditDetailsDefaultErrors,
          ...error.response.data.data,
        });
      }
    }

    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  return (
    <Fragment>
      <div className="content">
        <div className="create-property-wrap">
          <div className="main-heading-wrap flex-space-between-wrap mb-4">
            <div className="dashboard-heading-title">
              <h6 className="title">Job Details</h6>
            </div>
            <div className="flex-content">
              <div className="btn-wrap mr-2">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    history.push(paths.map);
                  }}
                  disabled={isFetching}
                >
                  Map
                </button>
              </div>

              <div className="btn-wrap">
                <button
                  disabled={isFetching}
                  className="btn btn-primary"
                  onClick={formSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="property-content-wrap">
            <div className="form-content-wrap">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <TextInputComp
                      name="title"
                      onChange={(val) => {
                        setJob({
                          ...job,
                          title: val,
                        });
                      }}
                      label="Job Title"
                      autoFocus
                      placeholder="Job Title *"
                      value={job.title}
                      errorMsg={errors.title}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <TextInputComp
                      name="formatted"
                      onChange={(value) => addressUpdate(value, 'formatted')}
                      label="Full Address"
                      placeholder="Full Address"
                      value={job.address.formatted}
                      errorMsg={errors.formatted}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <TextInputComp
                      name="city"
                      onChange={(value) => addressUpdate(value, 'city')}
                      label="City"
                      placeholder="City"
                      value={job.address.city}
                      errorMsg={errors.city}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <TextInputComp
                      name="state"
                      onChange={(value) => addressUpdate(value, 'state')}
                      label="State"
                      placeholder="State"
                      value={job.address.state}
                      errorMsg={errors.state}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-6">
                  <div className="form-group">
                    <DtRangeFilters
                      // timePicker
                      startDt={job.startDt}
                      endDt={job.endDt}
                      onChange={(startDt, endDt) => {
                        setJob({
                          ...job,
                          startDt,
                          endDt,
                        });
                      }}
                      errorMsg={errors.startDt || errors.endDt}
                      // format="MMM, DD YYYY"
                      format="YYYY-MM-DD"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-heading-wrap flex-space-between-wrap mb-4 py-2 pt-4">
        <div className="dashboard-heading-title">
          <h6 className="title">Job Members & Permissions</h6>
        </div>
        <div className="flex-content">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search members"
              value={searchFilter}
              onChange={(event) => {
                setSearchFilter(event.target.value);
              }}
            />
            <i className="fas fa-search" />
          </div>

          <Fragment>
            <div className="btn-wrap mr-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  history.push(paths.addMembers);
                }}
                disabled={isFetching}
                title="Add Members"
              >
                <PolyfillAddIcon className="mr-2" />
                Add Members
              </button>
            </div>
            <div className="btn-wrap">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedUser(utils.addJobDefaultUserGenerate());
                  history.push(paths.inviteMember);
                }}
                disabled={isFetching}
                title="Invite New"
              >
                <PolyfillAddIcon className="mr-2" />
                Invite New
              </button>
            </div>
          </Fragment>
        </div>
      </div>

      {/* <!-- user-table-wrap --> */}
      {!!errors.users && (
        <p className="text-danger">
          <small>{errors.users}</small>
        </p>
      )}
      <div className="user-table-wrap">
        <div className="table-responsive table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th
                  scope="col"
                  onClick={() => {
                    setSortOrder({
                      ...sortOrder,
                      name: sortOrder.name < 1 ? 1 : -1,
                    });
                  }}
                >
                  <div className="flex-content">
                    Name
                    <i
                      className={
                        sortOrder.name < 1
                          ? 'fas fa-sort-amount-down'
                          : 'fas fa-sort-amount-up'
                      }
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  // onClick={() => {
                  //   setSortOrder({
                  //     ...sortOrder,
                  //     email: sortOrder.email < 1 ? 1 : -1,
                  //   });
                  // }}
                >
                  <div className="flex-content">
                    Email
                    {/* <i
                      className={
                        sortOrder.email < 1
                          ? 'fas fa-sort-amount-down'
                          : 'fas fa-sort-amount-up'
                      }
                    /> */}
                  </div>
                </th>
                <th scope="col">
                  <div className="flex-content">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                if (!user.selected) {
                  return null;
                }

                return (
                  <tr key={index}>
                    <td>
                      <div className="user-icon">
                        <img
                          src={user.picURL || DefaultUserPic}
                          alt={user.name}
                          title={user.name}
                        />
                      </div>
                    </td>
                    <td className="text-bold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="icon-list flex-content">
                        <div
                          className="icon mr-2"
                          onClick={() => {
                            setSelectedUser({ ...user });

                            //  If user is invited then jump to invite user page, otherwise jump to edit user(Already Present User)
                            if (!user.id) {
                              history.push(paths.inviteMember);
                            } else {
                              history.push(paths.editMember);
                            }
                          }}
                        >
                          <i className="fas fa-pen" />
                        </div>

                        <div
                          className="icon"
                          onClick={() => {
                            const newUsers = [...users];
                            newUsers[index].selected = false;

                            setUsers(newUsers);
                            setAccountUsers(newUsers);
                          }}
                          title="Delete"
                        >
                          <i className="fas fa-trash" />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
}
