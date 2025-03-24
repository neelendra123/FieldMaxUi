import { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { CommonPerms } from '../../../constants';

import { successToast } from '../../../utils/toast';

import { InviteStatus, Popup } from '../../../components/Common';
import { PolyfillAddIcon } from '../../../components/Icons';

import { DefaultUserPic } from '../../Users/constants';

import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as utils from '../utils';
import * as services from '../services';
import { DeleteIcon, PencilIcon } from '../Icons';

export default function EditMembers({
  jobId,

  paths,
  currentUser,

  job,
  accountUsers,
  setSelectedUser,

  fetchDataEffect,
}: {
  jobId: string;

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

  //  This is the filtered users from account users on this page
  const [users, setUsers] = useState<interfaces.IEditJobUser[]>(accountUsers);

  //  Filters on Users Listing
  const [searchFilter, setSearchFilter] = useState('');
  const [sortOrder, setSortOrder] =
    useState<interfaces.IAddEditMembersSortFilter>({ name: 1, email: 1 });

  const [errors, setErrors] = useState({
    ...constants.AddEditDetailsDefaultErrors,
  });

  const [deleteMemberIndex, setDeleteMemberIndex] = useState(-1);

  //  For Filtering and Sorting Job Members Listing
  useEffect(() => {
    const { filteredMembers } = utils.filterJobMembers(
      searchFilter,
      sortOrder,
      accountUsers
    );

    setUsers(filteredMembers as interfaces.IEditJobUser[]);
  }, [accountUsers, searchFilter, sortOrder]);

  const MemberDeleteComponent = () => {
    const [isSaving, setIsSaving] = useState(false);

    const onSave = async () => {
      setIsSaving(true);

      let result = await services.jobMemberDeleteService(jobId, {
        userId: users[deleteMemberIndex].id,
      });

      if (!isMounted()) {
        return;
      }

      successToast(result.message);

      setDeleteMemberIndex(-1);

      await fetchDataEffect();
    };

    return (
      <Fragment>
        {deleteMemberIndex !== -1
          ? (document.body.className = 'fixed-position')
          : (document.body.className = '')}

        <Popup
          isOpen={deleteMemberIndex !== -1}
          title={'Delete Confirmation'}
          hideButton={false}
          onClose={() => setDeleteMemberIndex(-1)}
          leftItem={'Cancel'}
          leftFunction={() => setDeleteMemberIndex(-1)}
          onSave={onSave}
          ModalName={'Yes'}
          addClassToWrapper="card-media-box"
          leftItemViewOnlyClass="flex-space-center"
          disableButtons={isSaving}
        >
          <div className="sec-content">
            <p>
              Are you sure you want to delete the member:{' '}
              {users[deleteMemberIndex]?.name || ''} ?
            </p>
          </div>
        </Popup>
      </Fragment>
    );
  };

  const {
    isDeleted,
    currentUserJobPerm: { permissions },
  } = job;

  const allowUserAdd = !!(
    permissions.members &
    (CommonPerms.all | CommonPerms.add)
  );
  const allowUserEdit = !!(
    permissions.members &
    (CommonPerms.all | CommonPerms.edit)
  );
  const allowUserDelete = !!(
    permissions.members &
    (CommonPerms.all | CommonPerms.delete)
  );

  return (
    <Fragment>
      <MemberDeleteComponent />
      <div className="content">
        <div className="create-property-wrap">
          <div className="main-heading-wrap flex-space-between-wrap">
            <div className="dashboard-heading-title mb-4">
              <h6 className="title">Edit Members</h6>
            </div>
            <div className="flex-content-members mb-4 ">
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

              {allowUserAdd && (
                <div className="flex-content justify-content-between">
                  <div className="btn-wrap mr-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        history.push(paths.addMembers);
                      }}
                      disabled={isDeleted || isFetching}
                      title="Add Members"
                    >
                      <PolyfillAddIcon className="mr-2" />
                      Add Members
                    </button>
                  </div>
                  <div className="btn-wrap ">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        history.push(paths.inviteMember);
                      }}
                      disabled={isDeleted || isFetching}
                      title="Invite New"
                    >
                      <PolyfillAddIcon className="mr-2" />
                      Invite New
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* <!-- user-table-wrap --> */}
          {!!errors.users && (
            <p className="text-danger">
              <small>{errors.users}</small>
            </p>
          )}
          <div className="user-table-wrap d-none d-md-block">
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
                    <th scope="col">
                      <div className="flex-content">Invite Status</div>
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

                    const skipOptions =
                      user.id === currentUser.id ||
                      user.id === job.primaryUserId ||
                      isDeleted;

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
                          <InviteStatus status={user.invite.status} />
                        </td>
                        <td>
                          <div className="flex-content">
                            {!skipOptions && allowUserEdit && (
                              <div
                                className="icon mr-2"
                                title="Edit Member"
                                onClick={() => {
                                  setSelectedUser({ ...user });

                                  history.push(paths.editMember);
                                }}
                              >
                                <PencilIcon />
                              </div>
                            )}

                            {!skipOptions && allowUserDelete && (
                              <div
                                className="icon"
                                title="Delete Member"
                                onClick={() => {
                                  setDeleteMemberIndex(index);
                                }}
                              >
                                <DeleteIcon />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-block d-md-none">
            <table className="table  table-sm table-bordered max-mobile-table">
              <thead>
                <tr>
                  <th scope="col">Current Member </th>
                  <th scope="col" className="text-center">
                    Permission
                  </th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  if (!user.selected) {
                    return null;
                  }

                  const skipOptions =
                    user.id === currentUser.id ||
                    user.id === job.primaryUserId ||
                    isDeleted;

                  return (
                    <tr key={index}>
                      <td>
                        <div>
                          <b>{user.name}</b>
                          <p>{user.email}</p>
                        </div>
                      </td>

                      <td>
                        <div className="">
                          {!skipOptions && allowUserEdit && (
                            <div
                              className="icon mr-2 text-center"
                              title="Edit Member"
                              onClick={() => {
                                setSelectedUser({ ...user });

                                history.push(paths.editMember);
                              }}
                            >
                              <PencilIcon />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {!skipOptions && allowUserDelete && (
                          <div
                            className="icon text-center"
                            title="Delete Member"
                            onClick={() => {
                              setDeleteMemberIndex(index);
                            }}
                          >
                            <DeleteIcon />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {/* <tr>
                  <td scope='row'>
                    <div>
                      <b>Jitender Attri</b>
                      <p>jitenderattri3@gmail.com</p>
                    </div>
                  </td>
                  <td className='text-center'><PencilIcon /></td>
                  <td  ><DeleteIcon /></td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
