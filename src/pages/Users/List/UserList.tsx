import { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';
import { BiPencil, BiDotsVerticalRounded } from 'react-icons/bi';
import { FiChevronDown } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';

import { CommonPerms } from '../../../constants';

import { IAppReduxState } from '../../../redux/reducer';

import { generateDynamicPath, toLocaleDateString } from '../../../utils/common';
import { successToast } from '../../../utils/toast';

import Main from '../../../components/Layouts/Main';
import { MagnifierIcon } from '../../../components/Icons';
import { TextInputComp } from '../../../components/Forms';
import { InviteStatus, Popup } from '../../../components/Common';
import {
  Pagination,
  DefaultTablePageLimits,
} from '../../../components/Common/Pagination/Pagination';

import { PolyfillAddIcon } from '../../../components/Icons';

import UserRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as utils from '../utils';
import * as services from '../services';
import { UsersTableRowSkeletonComponent } from '../skeleton';

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
    auth: { accountIndex, authUser },
  } = useSelector((state: IAppReduxState) => state);

  const [userModulePerms] = useState(
    authUser.accounts[accountIndex].permissions.users
  );

  const [isLoaded, setIsLoaded] = useState(false); // For Skeleton

  const [totalRows, setTotalRows] = useState(0);
  const [rows, setRows] = useState<interfaces.IUser[]>([]);

  //  Filters
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DefaultTablePageLimits[0]);

  const [searchToggle, setSearchToggle] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [deleteIndex, setDeleteIndex] = useState(-1);

  const [sort, setSort] = useState<
    Record<'id' | 'firstName' | 'lastName' | 'email' | 'createdAt', 1 | -1>
  >({
    id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    createdAt: 1,
  });
  // const [mobileSort, setMobileSort] = useState<
  //   'email' | 'firstName' | 'createdAt'
  // >('email');
  // const mobileSortEffect = (sortValue: 1 | -1) => {
  //   setSort({
  //     ...sort,
  //     [mobileSort]: sortValue,
  //   });
  // };

  const fetchData = async () => {
    setIsLoaded(false);

    try {
      const result = await services.userListService({
        skip: (page - 1) * perPage,
        limit: perPage,
        sort,
        search: searchFilter,
      });
      if (!isMounted()) {
        return;
      }

      setRows(result.list);
      setTotalRows(result.count);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsLoaded(true);
  };

  const blockUnblock = async (userId: string, block: boolean) => {
    setIsLoaded(false);

    try {
      const result = await services.editBlockUserService(userId, block);
      if (!isMounted()) {
        return;
      }

      await fetchData();

      successToast(result.message);
    } catch (error) {}

    if (!isMounted()) {
      return;
    }

    setIsLoaded(true);
  };

  useEffect(() => {
    fetchData();
  }, [sort, searchFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  const RowsComp = () => {
    return (
      <Fragment>
        {rows.map((row, index) => {
          const userId = row.id;

          const name = utils.formatUserName(row.firstName, row.lastName);
          const picURL = row.picURL || constants.DefaultUserPic;

          const createdAt = toLocaleDateString(row.createdAt);

          const isBlocked = row.accounts[0].isBlocked;

          //  Editing Facility is not available for Self User, Owner of account, isSuperAdmin or isAdmin
          const editPath = generateDynamicPath(UserRoutes.routes.edit.path, {
            userId,
          });

          let actionsAllowed = true;
          const currentUserTypes = utils.getUserTypes(
            row.userType,
            row.accounts[0].userType
          );
          if (
            userId === authUser.id ||
            currentUserTypes.isSuperAdmin ||
            currentUserTypes.isAdmin ||
            currentUserTypes.isOwner
          ) {
            actionsAllowed = false;
          }

          const deleteAllowed = !!(
            userModulePerms.base &
            (CommonPerms.all | CommonPerms.delete)
          );

          return (
            <Fragment key={userId}>
              <tr className="mobile-d-none">
                <td className="d-flex justify-content-center">
                  <img
                    className="rounded-40"
                    src={picURL}
                    alt={name}
                    title={name}
                  />
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className=" pl-3">{name}</div>
                  </div>
                </td>
                <td>{row.email}</td>
                <td>
                  {isBlocked ? (
                    <button className="inactive-btn">InActive</button>
                  ) : (
                    <button className="active-btn">Active</button>
                  )}
                </td>
                <td>
                  <InviteStatus status={row.accounts[0].invite.status} />
                </td>
                {/* <td>{accountUserTypesStr}</td> */}
                <td>{createdAt}</td>
                <td>
                  {actionsAllowed && (
                    <Fragment>
                      {UserRoutes.routes.edit.access && (
                        <Fragment>
                          <div
                            className="light-icon mr-2"
                            onClick={() => {
                              history.push(editPath, {
                                user: row,
                              });
                            }}
                          >
                            <BiPencil />
                          </div>
                          <div
                            className="light-icon px-2 pt-1 mr-2"
                            onClick={() => {
                              blockUnblock(userId, !isBlocked);
                            }}
                          >
                            <input
                              type="checkbox"
                              style={{ display: 'none' }}
                              id="username"
                              checked={!isBlocked}
                              onChange={(event) => {
                                event.preventDefault();
                              }}
                            />
                            <label className="switch mb-0" htmlFor="username" />
                          </div>
                        </Fragment>
                      )}

                      {/* <div
                        className="light-icon mr-2"
                        onClick={(e) => setDeleteIndex(index)}
                      >
                        <ReInviteIcon />
                      </div> */}

                      {deleteAllowed && (
                        <div
                          className="light-icon"
                          onClick={(e) => setDeleteIndex(index)}
                        >
                          <AiOutlineDelete />
                        </div>
                      )}
                    </Fragment>
                  )}
                </td>
              </tr>
              <tr className="d-block d-md-none p-3 position-relative">
                <td>
                  {actionsAllowed && (
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
                        {UserRoutes.routes.edit.access && (
                          <Fragment>
                            <Link className="dropdown-item" to={editPath}>
                              Edit
                            </Link>

                            <button
                              className="dropdown-item"
                              onClick={() => {
                                blockUnblock(userId, !isBlocked);
                              }}
                            >
                              {isBlocked ? 'Activate' : 'InActivate'}
                            </button>
                          </Fragment>
                        )}

                        {deleteAllowed && (
                          <button
                            className="dropdown-item"
                            onClick={(e) => setDeleteIndex(index)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="d-flex">
                    <div className="mr-3">
                      <img
                        className="rounded-40"
                        src={picURL}
                        alt={name}
                        title={name}
                      />
                    </div>

                    <div className="user-mobile-description">
                      <h6 className="mb-0 fs-18">{name}</h6>
                      <p>{row.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 border-top">
                    <div className="d-flex mt-2 w-100 justify-content-between">
                      <div>
                        <p className="fs-12 mb-0">
                          Status :{' '}
                          <span className="text-dark">
                            {isBlocked ? 'InActive' : 'Active'}
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
                    {/* <p className="fs-12 mb-0">
                      Type:{' '}
                      <span className="text-dark">{accountUserTypesStr}</span>
                    </p> */}
                  </div>
                </td>
              </tr>
            </Fragment>
          );
        })}
      </Fragment>
    );
  };

  const DeleteComp = () => {
    const deleteRow = async () => {
      try {
        setIsLoaded(false);

        const result = await services.userDeleteService(rows[deleteIndex].id);
        if (!isMounted()) {
          return;
        }

        await fetchData();

        successToast(result.message);

        setDeleteIndex(-1);
      } catch (error) {
        console.error(error);
      }

      if (!isMounted()) {
        return;
      }

      setIsLoaded(true);
    };

    return (
      <Fragment>
        <Popup
          isOpen={deleteIndex !== -1}
          title="Delete Confirmation"
          hideButton={false}
          onClose={() => setDeleteIndex(-1)}
          leftItem="Cancel"
          leftFunction={() => setDeleteIndex(-1)}
          onSave={deleteRow}
          ModalName={'Delete'}
          addClassToWrapper="card-media-box"
          leftItemViewOnlyClass="flex-space-center"
          disableButtons={!isLoaded}
        >
          <div className="sec-content">
            <p>
              Are you sure you want to delete the User{' '}
              {rows[deleteIndex]?.firstName || ''}?
            </p>
          </div>
        </Popup>
      </Fragment>
    );
  };

  return (
    <Main sideBarId={UserRoutes.routes.list.sideBarId}>
      <DeleteComp />

      <div className="grid-in mx-2">
        <div className="main-heading-wrap flex-space-between ipad-flex-wrap mb-4">
          <div className="dashboard-heading-title d-flex ipad-w-100">
            <h5 className="title">{UserRoutes.name}</h5>
          </div>
          <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0">
            <form className="d-none d-md-inline ml-auto">
              <div className="form-group ipad-mr-0">
                <TextInputComp
                  name="searchFilter"
                  type="text"
                  className="form-control"
                  placeholder="Search users"
                  onChange={setSearchFilter}
                  value={searchFilter}
                />
                <i className="fas fa-search" />
              </div>
            </form>
            {UserRoutes.routes.add.access && (
              <div className="btn-wrap ">
                <Link
                  className="btn btn-primary"
                  to={UserRoutes.routes.add.path}
                >
                  <PolyfillAddIcon className="mr-2" />
                  Add New
                </Link>
              </div>
            )}
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
                  placeholder="Search users"
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
            </div>
          </div>

          <div className=" flex-content ml-auto">
            <div
              className="search-icon"
              onClick={(e) => setSearchToggle(!searchToggle)}
            >
              <MagnifierIcon />
            </div>
          </div>
        </div>

        <div className="user-table-wrap jobs-grid-table mobile-table">
          <div className="table-wrap">
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
                    <div className="flex-content">Status</div>
                  </th>
                  <th scope="col">
                    <div className="flex-content">Invite Status</div>
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
                    <div className="flex-content">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="px-0 py-3">{isLoaded && <RowsComp />}</tbody>
            </table>

            {!isLoaded && <UsersTableRowSkeletonComponent rows={5} />}

            {isLoaded && (
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
