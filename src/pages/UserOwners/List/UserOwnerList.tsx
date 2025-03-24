import { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { FiChevronDown } from 'react-icons/fi';

import { IAppReduxState } from '../../../redux/reducer';

import { successToast } from '../../../utils/toast';
import { generateDynamicPath, toLocaleDateString } from '../../../utils/common';

import Main from '../../../components/Layouts/Main';
import { TextInputComp } from '../../../components/Forms';
import { InviteStatus, IsFetching, Popup } from '../../../components/Common';
import {
  Pagination,
  DefaultTablePageLimits,
} from '../../../components/Common/Pagination/Pagination';
import {
  PolyfillAddIcon,
  MagnifierIcon,
  BigMail,
  OwnerIcon,
} from '../../../components/Icons';

import { formatUserName } from '../../Users/utils';

import { IInviteStatusKind } from '../../Invites/interfaces';

import { DeleteIcon } from '../../Jobs/Icons';

import * as interfaces from '../interfaces';
import * as services from '../services';
import UserOwnerRoutes from '../routes';

const MobileSortOptions: {
  label: string;
  value: Record<string, 1 | -1>;
}[] = [
  { label: 'Name Asc', value: { firstName: 1, lastName: 1 } },
  { label: 'Name Desc', value: { firstName: -1, lastName: -1 } },
  { label: 'Email Asc', value: { email: 1 } },
  { label: 'Email Desc', value: { email: -1 } },
  { label: 'Created Asc', value: { createdAt: 1 } },
  { label: 'Created Desc', value: { createdAt: -1 } },
];

export default function UserList() {
  const isMounted = useMountedState();

  const history = useHistory();

  const {
    auth: { accountIndex, authUser, accountsPermissions, accountsUserTypes },
  } = useSelector((state: IAppReduxState) => state);

  const [perms, setPerms] = useState(
    accountsPermissions[accountIndex].userOwners
  );

  const [isFetching, setIsFetching] = useState(false);

  const [totalRows, setTotalRows] = useState(0);
  const [rows, setRows] = useState<interfaces.IUserOwner[]>([]);

  //  Filters
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DefaultTablePageLimits[0]);

  const [searchToggle, setSearchToggle] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [inviteIndex, setInviteIndex] = useState(-1);

  const [sort, setSort] = useState<
    Record<'id' | 'firstName' | 'lastName' | 'email' | 'createdAt', 1 | -1>
  >({
    id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    createdAt: 1,
  });

  const fetchData = async () => {
    setIsFetching(true);

    try {
      const result = await services.userOwnersListService({
        skip: (page - 1) * perPage,
        limit: perPage,
        sort,
        search: searchFilter,
      });

      if (!isMounted()) {
        return;
      }

      setTotalRows(result.count);
      setRows(result.records);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };
  const blockUnblockRow = async (userOwnerId: string, isActive: boolean) => {
    setIsFetching(true);

    try {
      const result = await services.userOwnerBlockService(
        userOwnerId,
        isActive
      );
      if (!isMounted()) {
        return;
      }

      await fetchData();

      successToast(result.message);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };
  const deleteRow = async () => {
    setIsFetching(true);

    try {
      const result = await services.userOwnerDeleteService(
        rows[deleteIndex].id
      );
      if (!isMounted()) {
        return;
      }

      await fetchData();

      successToast(result.message);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
    setDeleteIndex(-1);
  };
  const inviteRow = async () => {
    setIsFetching(true);

    try {
      const result = await services.userOwnerInviteService(
        rows[inviteIndex].id
      );
      if (!isMounted()) {
        return;
      }

      await fetchData();

      successToast(result.message);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
    setInviteIndex(-1);
  };

  useEffect(() => {
    fetchData();
  }, [sort, searchFilter, page]);
  useEffect(() => {
    setPage(1);
  }, [perPage]);

  useEffect(() => {
    setPerms(accountsPermissions[accountIndex].userOwners);
  }, [authUser, accountIndex, accountsPermissions]);

  const skipPermCheck =
    accountsUserTypes[accountIndex].isAdmin ||
    accountsUserTypes[accountIndex].isOwner ||
    accountsUserTypes[accountIndex].isSuperAdmin;

  const RowsComponent = () => {
    return (
      <Fragment>
        {rows.map((record, index) => {
          const accessIndex = record.access.users.indexOf(authUser.id);

          const editAllowed =
            skipPermCheck ||
            ((perms.base.all || perms.base.edit) &&
              (record.access.all || accessIndex != -1));

          const viewAllowed =
            skipPermCheck ||
            ((perms.base.all || perms.base.edit || perms.base.view) &&
              (record.access.all || accessIndex != -1));

          const deleteAllowed =
            skipPermCheck ||
            ((perms.base.all || perms.base.delete) &&
              (record.access.all || accessIndex != -1));

          const userOwnerId = record.id;

          const name = formatUserName(record.firstName, record.lastName);

          const createdAt = toLocaleDateString(record.createdAt);

          const editPath = generateDynamicPath(
            UserOwnerRoutes.routes.edit.path,
            { userOwnerId }
          );

          const detailsRedirect = () => {
            {
              if (!viewAllowed) {
                return;
              }

              const detailPath = generateDynamicPath(
                UserOwnerRoutes.routes.details.path,
                { userOwnerId }
              );

              history.push(detailPath);
            }
          };

          const Pic = record.picURL ? (
            <img
              className="rounded-40"
              // className="account-user-img"
              src={record.picURL}
              alt={name}
              title={name}
            />
          ) : (
            <OwnerIcon />
          );

          return (
            <Fragment key={userOwnerId}>
              {/* Desktop View */}
              <tr className="mobile-d-none">
                <td
                  className="d-flex justify-content-center"
                  onClick={detailsRedirect}
                >
                  {Pic}
                </td>
                <td className="owner_table">
                  <div
                    className="d-flex align-items-center"
                    onClick={detailsRedirect}
                  >
                    <div className=" pl-3">{name}</div>
                  </div>
                </td>
                <td className="owner_table" style={{ textAlignLast: 'end' }}>
                  {record.email}
                </td>
                <td className="property_address">{record.taxId}</td>
                <td className="property_address">{createdAt}</td>
                <td>
                  {record.isActive ? (
                    <button className="active-btn">Active</button>
                  ) : (
                    <button className="inactive-btn">InActive</button>
                  )}
                </td>
                <td>
                  <InviteStatus status={record.invite?.status} />
                </td>
                <td>
                  {editAllowed && (
                    <div
                      className="light-icon px-2 pt-1 mr-2"
                      onClick={() => {
                        blockUnblockRow(userOwnerId, !record.isActive);
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{ display: 'none' }}
                        id={userOwnerId}
                        checked={record.isActive}
                        onChange={(event) => {
                          event.preventDefault();
                        }}
                      />
                      <label className="switch mb-0" htmlFor={userOwnerId} />
                    </div>
                  )}

                  {deleteAllowed && (
                    <div
                      className="light-icon px-1 py-0 mr-2"
                      onClick={(e) => setDeleteIndex(index)}
                    >
                      <DeleteIcon className="fz-12" />
                    </div>
                  )}

                  <div className="light-icon dropleft">
                    <h6
                      className="dropdown-toggle mb-0 c-pointer"
                      role="button"
                      id="dropdownoption"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <BiDotsVerticalRounded />
                    </h6>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownoption"
                    >
                      <Fragment>
                        {editAllowed && (
                          <Fragment>
                            {record.invite?.status !==
                              IInviteStatusKind.accepted && (
                              <div
                                className="dropdown-item fz-14"
                                onClick={() => setInviteIndex(index)}
                              >
                                Invite User
                              </div>
                            )}

                            <div className="dropdown-divider" />

                            <Link className="dropdown-item fz-14" to={editPath}>
                              Edit Details
                            </Link>
                          </Fragment>
                        )}
                      </Fragment>
                    </div>
                  </div>
                </td>
              </tr>
              {/* Mobile View */}
              <tr className="d-block d-md-none p-3 position-relative">
                <td>
                  <div className="card-right-icon dropleft">
                    <h6
                      className="dropdown-toggle mb-0 c-pointer"
                      role="button"
                      id="dropdownoption"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <BiDotsVerticalRounded />
                    </h6>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownoption"
                    >
                      {editAllowed && (
                        <Fragment>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              blockUnblockRow(record.id, !record.isActive);
                            }}
                          >
                            {!record.isActive ? 'Activate' : 'InActivate'}
                          </button>

                          {record.invite?.status !==
                            IInviteStatusKind.accepted && (
                            <Fragment>
                              <div className="dropdown-divider" />
                              <div
                                className="dropdown-item"
                                onClick={(e) => setInviteIndex(index)}
                              >
                                Invite User
                              </div>
                            </Fragment>
                          )}

                          <div className="dropdown-divider" />
                          <Link className="dropdown-item" to={editPath}>
                            Edit Details
                          </Link>
                        </Fragment>
                      )}

                      {deleteAllowed && (
                        <Fragment>
                          <div className="dropdown-divider" />
                          <div
                            className="dropdown-item"
                            onClick={(e) => setDeleteIndex(index)}
                          >
                            Delete
                          </div>
                        </Fragment>
                      )}
                    </div>
                  </div>

                  <div className="d-flex" onClick={detailsRedirect}>
                    <div className="mr-3">{Pic}</div>

                    <div className="user-mobile-description">
                      <h6 className="mb-0 fs-18">{name}</h6>
                      <p>{record.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 border-top">
                    <div className="d-flex mt-2 w-100 justify-content-between">
                      <div>
                        <p className="fs-12 mb-0">
                          Status :{' '}
                          <span className="text-dark">
                            {!record.isActive ? 'InActive' : 'Active'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="fs-12 mb-0">
                          Created On :{' '}
                          <span className="text-dark">{createdAt}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </Fragment>
          );
        })}
      </Fragment>
    );
  };

  return (
    <Main sideBarId={UserOwnerRoutes.routes.list.sideBarId}>
      {isFetching && <IsFetching />}

      <Popup
        isOpen={deleteIndex !== -1}
        title="Delete Confirmation"
        hideButton={false}
        onClose={() => setDeleteIndex(-1)}
        leftItem="Cancel"
        leftFunction={() => setDeleteIndex(-1)}
        onSave={deleteRow}
        ModalName="Delete"
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
        disableButtons={isFetching}
      >
        <div className="sec-content">
          <p>Are you sure you want to delete the Owner?</p>
        </div>
      </Popup>

      <Popup
        isOpen={inviteIndex !== -1}
        title="Send Invite"
        hideButton={true}
        onClose={() => setInviteIndex(-1)}
        ModalName="Send Invite"
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
        disableButtons={isFetching}
      >
        <div className="text-left">
          <div>
            <div className="d-flex justify-content-center w-100">
              <BigMail />
            </div>
            <p className="text-center mt-3">
              Generate and send platform invite link to the user.
            </p>

            <div>
              <button
                className="btn btn-primary w-100 mt-2"
                onClick={inviteRow}
                disabled={isFetching}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      </Popup>

      <div className="grid-in mx-2">
        <div className="main-heading-wrap flex-space-between ipad-flex-wrap mb-4">
          <div className="dashboard-heading-title d-flex ipad-w-100">
            <h5 className="title">Owners</h5>
          </div>
          <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0">
            <form className="d-none d-md-inline ml-auto">
              <div className="form-group ipad-mr-0">
                <TextInputComp
                  name="searchFilter"
                  type="text"
                  className="form-control"
                  placeholder="Search Owners"
                  onChange={setSearchFilter}
                  value={searchFilter}
                />
                <i className="fas fa-search" />
              </div>
            </form>

            <div className="btn-wrap ">
              <Link
                className="btn btn-primary"
                to={UserOwnerRoutes.routes.add.path}
                title="Add New"
              >
                <PolyfillAddIcon className="mr-2" />
                Add New
              </Link>
            </div>
          </div>
        </div>
        {searchToggle && (
          <div className="d-md-none d-block w-100">
            <form>
              <div className="form-group search-box">
                <TextInputComp
                  name="searchFilter"
                  type="text"
                  className="form-control"
                  placeholder="Search Owner"
                  onChange={setSearchFilter}
                  value={searchFilter}
                />
                <i className="fas fa-search" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile View Only */}
        <div className="d-md-none d-flex w-100 align-items-center">
          <div className="dropdown">
            <h6
              className="dropdown-toggle mb-0 c-pointer"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Sort <FiChevronDown className="color-primary" />
            </h6>

            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              {MobileSortOptions.map((option, index) => {
                return (
                  <button
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      //@ts-ignore
                      setSort({ ...option.value });
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}

              {/* <button
                className="dropdown-item"
                onClick={() => setMobileSort('createdAt')}
              >
                Created
              </button> */}
            </div>
          </div>

          <div className="flex-content ml-auto">
            {/* <button
              className="grid-list-icon"
              onClick={() => mobileSortEffect(1)}
            >
              <BiSortUp className="icon-24 mr-2 light-gray" />
            </button>
            <button
              className="grid-list-icon"
              onClick={() => mobileSortEffect(-1)}
            >
              <BiSortDown className="icon-24 mr-2 light-gray" />
            </button> */}
            <div
              className="search-icon"
              onClick={(e) => setSearchToggle(!searchToggle)}
            >
              <MagnifierIcon />
            </div>
          </div>
        </div>

        <div className="user-table-wrap jobs-grid-table mobile-table">
          <div className="cam-responsive-table">
            <table className="table">
              <thead className="mobile-d-none">
                <tr className="shadow-none">
                  <th />
                  <th
                    scope="col"
                    onClick={() => {
                      setSort({
                        ...sort,
                        firstName: sort.firstName === -1 ? 1 : -1,
                        lastName: sort.lastName === -1 ? 1 : -1,
                      });
                    }}
                  >
                    <div className="flex-content pl-3">
                      Name
                      {sort.firstName === 1 ? (
                        <FaSortAmountUp className="ml-2" />
                      ) : (
                        <FaSortAmountDown />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => {
                      setSort({
                        ...sort,
                        email: sort.email === -1 ? 1 : -1,
                      });
                    }}
                  >
                    <div className="flex-content">
                      Email{' '}
                      {sort.email === 1 ? (
                        <FaSortAmountUp className="ml-2" />
                      ) : (
                        <FaSortAmountDown />
                      )}
                    </div>
                  </th>
                  <th scope="col">
                    <div className="flex-content">Tax ID</div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => {
                      setSort({
                        ...sort,
                        createdAt: sort.createdAt === -1 ? 1 : -1,
                      });
                    }}
                  >
                    <div className="flex-content">
                      Created{' '}
                      {sort.createdAt === 1 ? (
                        <FaSortAmountUp className="ml-2" />
                      ) : (
                        <FaSortAmountDown />
                      )}
                    </div>
                  </th>

                  <th scope="col">
                    <div className="flex-content">Status</div>
                  </th>

                  <th scope="col">
                    <div className="flex-content">Invite Status</div>
                  </th>

                  <th scope="col">
                    <div className="flex-content">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="px-0 py-3">
                {!isFetching && <RowsComponent />}
              </tbody>
            </table>

            {!isFetching && (
              <Pagination
                totalRows={totalRows}
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            )}
          </div>
        </div>
      </div>
    </Main>
  );
}
