import { Fragment, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { PolyfillAddIcon } from '../../../components/Icons';

import { DefaultUserPic } from '../../Users/constants';

import * as interfaces from '../interfaces';
import * as utils from '../utils';

export default function AddMembers({
  paths,
  job,
  accountUsers,
  setAccountUsers,
  setSelectedUser,
}: {
  paths: interfaces.IJobAddPaths;

  job: interfaces.IJobPopulated;

  accountUsers: interfaces.IAddJobUser[];
  setAccountUsers: (accountUsers: interfaces.IAddJobUser[]) => void;

  setSelectedUser: (accountUsers: interfaces.IAddJobUser) => void;
}) {
  const history = useHistory();

  // const [isFetching, setIsFetching] = useState(false);

  //  This is the filtered users from account users on this page
  const [users, setUsers] = useState<interfaces.IAddJobUser[]>(
    // accountUsers.filter((accountUser) => accountUser.selected)
    accountUsers
  );

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

  return (
    <Fragment>
      {/* <!--Container Main start--> */}
      <div className="content">
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
              <div className="btn-wrap mr-2">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    history.push(paths.map);
                  }}
                >
                  Map
                </button>
              </div>
              <div className="btn-wrap mr-3 d-none d-md-inline">
                <Link
                  className="btn btn-primary"
                  to={paths.details}
                  title="Add Selected Members"
                >
                  <PolyfillAddIcon className="mr-2" />
                  Add Selected Members
                </Link>
              </div>
              <div className="btn-wrap">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedUser(utils.addJobDefaultUserGenerate());
                    history.push(paths.inviteMember);
                  }}
                  title="Invite New"
                >
                  <PolyfillAddIcon className="mr-2" />
                  Invite New
                </button>
              </div>
            </div>
          </div>
          {/* user-table-wrap */}
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
                    {/* <th scope="col">
                      <div className="flex-content">Actions</div>
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    if (!user.id || user.skip) {
                      return null;
                    }

                    return (
                      <tr key={index}>
                        <td>
                          <div className="checkbox-card">
                            <div className="flex-content">
                              <span className="check-card">
                                <input
                                  className="flat-red"
                                  type="checkbox"
                                  checked={user.selected}
                                  onChange={(event) => {
                                    //  Updating the parent Account Users with new selected
                                    const { filteredMembers, searchUserIndex } =
                                      utils.filterJobMembers(
                                        '',
                                        null,
                                        accountUsers,
                                        user.email
                                      );
                                    filteredMembers[searchUserIndex].selected =
                                      event.target.checked;
                                    setAccountUsers(
                                      filteredMembers as interfaces.IAddJobUser[]
                                    );

                                    //  Updating the current user listing with the new selected
                                    const newUsers = [...users];
                                    newUsers[index].selected =
                                      event.target.checked;
                                    setUsers(newUsers);
                                  }}
                                />
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="user-icon">
                            <img
                              title={user.name}
                              alt={user.name}
                              src={user.picURL || DefaultUserPic}
                            />
                          </div>
                        </td>
                        <td className="text-bold">{user.name}</td>
                        <td>{user.email}</td>
                        {/* <td>
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
