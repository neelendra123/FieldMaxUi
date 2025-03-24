import { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { CommonPerms } from '../../../constants';

import { successToast } from '../../../utils/toast';

import { PolyfillAddIcon } from '../../../components/Icons';

import { DefaultUserPic } from '../../Users/constants';

import * as interfaces from '../interfaces';
import * as utils from '../utils';
import * as services from '../services';

export default function AddMembers({
  paths,
  currentUser,
  job,
  accountUsers,
  setSelectedUser,

  fetchDataEffect,
}: {
  paths: interfaces.IJobEditMembersPaths;
  currentUser: {
    email: string;
    id: string;
  };

  job: interfaces.IJobPopulated;

  accountUsers: interfaces.IEditJobUser[];

  setSelectedUser: (accountUsers: interfaces.IEditJobUser) => void;

  fetchDataEffect: () => void;
}) {
  const isMounted = useMountedState();

  const history = useHistory();

  const [isFetching, setIsFetching] = useState(false);

  const [jobMembers, setJobMembers] = useState([...accountUsers]);

  //  This is the filtered users from account users on this page
  const [users, setUsers] = useState<interfaces.IEditJobUser[]>([
    ...accountUsers,
  ]);

  const [permissions] = useState({
    add: !!(
      job.currentUserJobPerm.permissions.members &
      (CommonPerms.all | CommonPerms.add)
    ),
    edit: !!(
      job.currentUserJobPerm.permissions.members &
      (CommonPerms.all | CommonPerms.edit)
    ),
    delete: !!(
      job.currentUserJobPerm.permissions.members &
      (CommonPerms.all | CommonPerms.delete)
    ),
  });

  //  Filters on Users Listing
  const [searchFilter, setSearchFilter] = useState('');
  const [sortOrder, setSortOrder] =
    useState<interfaces.IAddEditMembersSortFilter>({ name: 1, email: 1 });

  const onSave = async () => {
    try {
      setIsFetching(true);

      let members: interfaces.IJobMemberEditReqData[] = [];
      users.filter((user) => {
        if (user.selected) {
          members.push({
            userId: user.id,
            permissions: user.permissions,
          });
        }
      });

      let result = await services.jobMembersAddService(job.id, {
        users: members,
      });
      if (!isMounted()) {
        return;
      }

      successToast(result.message);

      await fetchDataEffect();

      history.push(paths.base);
    } catch (error: any) {}

    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  //  For Filtering and Sorting Job Members Listing
  useEffect(() => {
    const { filteredMembers } = utils.filterJobMembers(
      searchFilter,
      sortOrder,
      jobMembers
    );

    setUsers(filteredMembers as interfaces.IEditJobUser[]);
  }, [searchFilter, sortOrder]);

  return (
    <Fragment>
      <div className="">
        <div className="create-property-wrap">
          <div className="main-heading-wrap flex-space-between-wrap mb-4 py-2 pt-4">
            <div className="dashboard-heading-title">
              <h6 className="title">Add Members</h6>
            </div>
            <div className="flex-content job-btn mobile-w-100">
              <form className="d-block d-md-inline mobile-w-100">
                <div className="form-group mobile-mr-0">
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
              </form>
              <div className="btn-wrap mr-3 d-none d-md-inline">
                <button
                  className="btn btn-primary"
                  onClick={onSave}
                  disabled={isFetching}
                  title="Add Selected Members"
                >
                  <PolyfillAddIcon className="mr-2" />
                  Add Selected Members
                </button>
              </div>
              <div className="btn-wrap mr-3 d-none d-md-inline">
                <button
                  className="btn btn-warning"
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

          <div className="user-table-wrap">
            <div className="table-responsive table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col"></th>
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
                      onClick={() => {
                        setSortOrder({
                          ...sortOrder,
                          email: sortOrder.email < 1 ? 1 : -1,
                        });
                      }}
                    >
                      <div className="flex-content">
                        Email
                        <i
                          className={
                            sortOrder.email < 1
                              ? 'fas fa-sort-amount-down'
                              : 'fas fa-sort-amount-up'
                          }
                        />
                      </div>
                    </th>
                    {/* <th scope="col">
                      <div className="flex-content">Actions</div>
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const skipOptions =
                      user.id === currentUser.id ||
                      user.id === job.primaryUserId ||
                      job.isDeleted;

                    return (
                      <tr key={index}>
                        <td>
                          <div className="checkbox-card">
                            {!skipOptions && permissions.add && (
                              <div className="flex-content">
                                <span className="check-card">
                                  <input
                                    className="flat-red"
                                    type="checkbox"
                                    checked={user.selected}
                                    disabled={
                                      (user.selected && !permissions.delete) ||
                                      (!user.selected && !permissions.add)
                                    }
                                    onChange={(event) => {
                                      const selected = event.target.checked;

                                      const newUsers = [...users];
                                      newUsers[index].selected = selected;
                                      setUsers(newUsers);
                                    }}
                                  />
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
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
                        {/* <td>
                          {!skipOptions && permissions.edit && (
                            <div className="icon-list flex-content">
                              <div
                                className="icon mr-2"
                                onClick={() => {
                                  setSelectedUser({ ...user });
                                  history.push(paths.editMember);
                                }}
                              >
                                <i className="fas fa-pen" />
                              </div>
                            </div>
                          )}
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
