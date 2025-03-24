import { Fragment, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';
import { useSelector } from 'react-redux';

import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { BiPencil, BiDotsVerticalRounded } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';

import {
  convertToPermisson,
  generateDynamicPath,
  toLocaleDTString,
} from '../../../utils/common';
import { successToast } from '../../../utils/toast';

import { IAppReduxState } from '../../../redux/reducer';

import Main from '../../../components/Layouts/Main';
import { TextInputComp } from '../../../components/Forms';
import {
  Pagination,
  DefaultTablePageLimits,
} from '../../../components/Common/Pagination/Pagination';
import { IsFetching, Popup } from '../../../components/Common';
import { PolyfillAddIcon, MagnifierIcon } from '../../../components/Icons';

import { googleDirectionPath } from '../../Address/utils';

import { PropertiesCircleIcon } from '../Icons';
import PropertiesRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as services from '../services';

const MobileSortOptions: {
  label: string;
  value: Record<string, 1 | -1>;
}[] = [
  { label: 'Name Asc', value: { name: 1 } },
  { label: 'Name Desc', value: { name: -1 } },
  { label: 'Created Asc', value: { createdAt: 1 } },
  { label: 'Created Desc', value: { createdAt: -1 } },
];

export default function PropertiesList() {
  const isMounted = useMountedState();
  const history = useHistory();

  const {
    auth: { accountIndex, authUser, accountsPermissions, accountsUserTypes },
  } = useSelector((state: IAppReduxState) => state);

  const [perms, setPerms] = useState(
    accountsPermissions[accountIndex].properties
  );

  const [isFetching, setIsFetching] = useState(false);

  const [propertiesPermissions] = useState(
    convertToPermisson(
      authUser.accounts[accountIndex].permissions.properties.base
    )
  );

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');

  const [totalRows, setTotalRows] = useState(0);
  const [rows, setRows] = useState<interfaces.IProperty[]>([]);

  //  Filters
  const [searchToggle, setSearchToggle] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [sort, setSort] = useState<Record<'name' | 'createdAt', 1 | -1>>({
    name: 1,
    createdAt: 1,
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DefaultTablePageLimits[0]);

  const [deleteIndex, setDeleteIndex] = useState(-1);

  const fetchData = async () => {
    setIsFetching(true);

    try {
      const result = await services.propertiesListService({
        skip: (page - 1) * perPage,
        limit: perPage,
        sort,
        search: searchFilter,
      });
      if (!isMounted()) {
        return;
      }

      setRows(result.records);
      setTotalRows(result.count);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  const blockUnblock = async (propertyId: string, isActive: boolean) => {
    setIsFetching(true);

    try {
      const result = await services.propertyBlockService(propertyId, isActive);
      if (!isMounted()) {
        return;
      }

      await fetchData();

      successToast(result.message);
    } catch (error) {}

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  const blockUnblockRow = async (id: string, isActive: boolean) => {
    setIsFetching(true);

    try {
      const result = await services.propertyBlockService(id, isActive);
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
      const result = await services.propertyDeleteService(rows[deleteIndex].id);
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

  useEffect(() => {
    fetchData();
  }, [sort, searchFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  useEffect(() => {
    function handleWindowSizeChange() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    setPerms(accountsPermissions[accountIndex].properties);
  }, [authUser, accountIndex, accountsPermissions]);

  const skipPermCheck =
    accountsUserTypes[accountIndex].isAdmin ||
    accountsUserTypes[accountIndex].isOwner ||
    accountsUserTypes[accountIndex].isSuperAdmin;

  const RowsComponent = () => {
    return (
      <>
        {rows.map((record, index: number) => {
          const accessIndex = record.access.users.indexOf(authUser.id);

          //  Each Record will have its set of permissions
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

          const propertyId = record.id;
          const name = record.name;

          const createdAt = toLocaleDTString(record.createdAt);

          const editPath = generateDynamicPath(
            PropertiesRoutes.routes.edit.path,
            { propertyId }
          );

          const detailsRedirect = () => {
            {
              if (!viewAllowed) {
                return;
              }

              const detailPath = generateDynamicPath(
                PropertiesRoutes.routes.details.path,
                { propertyId }
              );

              history.push(detailPath);
            }
          };

          const Pic = record.picURL ? (
            <img
              src={record.picURL}
              alt={name}
              title={name}
              className="rounded-40"
            />
          ) : (
            <PropertiesCircleIcon />
          );

          return (
            <Fragment key={propertyId}>
              {/* Desktop View */}
              <tr className="mobile-d-none">
                <td onClick={detailsRedirect}>{Pic}</td>
                <td className="text-bold c-pointer" onClick={detailsRedirect}>
                  {record.name} ({record.shortName})
                </td>
                <td
                  className="property_address"
                  onClick={() => {
                    const googlePath = googleDirectionPath(
                      record.primaryAddress.location.coordinates[0],
                      record.primaryAddress.location.coordinates[1],
                      record.primaryAddress.formatted
                    );

                    window.open(googlePath, '_blank');
                  }}
                >
                  {record.primaryAddress.formatted}
                </td>
                <td>
                  {record.isActive ? (
                    <button className="active-btn">Active</button>
                  ) : (
                    <button className="inactive-btn">InActive</button>
                  )}
                </td>
                <td className="contributers-wrap property_address">{createdAt}</td>
                <td>
                  {editAllowed && (
                    <Fragment>
                      <div
                        className="light-icon mr-2"
                        onClick={() => {
                          const path = generateDynamicPath(
                            PropertiesRoutes.routes.edit.path,
                            {
                              propertyId: record.id,
                            }
                          );

                          history.push(path);
                        }}
                      >
                        <BiPencil />
                      </div>

                      <div
                        className="light-icon px-2 pt-1 mr-2"
                        onClick={() => {
                          blockUnblock(propertyId, !record.isActive);
                        }}
                      >
                        <input
                          type="checkbox"
                          style={{ display: 'none' }}
                          id={propertyId}
                          checked={record.isActive}
                          onChange={(event) => {
                            event.preventDefault();
                          }}
                        />

                        <label className="switch mb-0" htmlFor={propertyId} />
                      </div>
                    </Fragment>
                  )}

                  {deleteAllowed && (
                    <div
                      className="light-icon"
                      onClick={() => {
                        setDeleteIndex(index);
                      }}
                    >
                      <AiOutlineDelete />
                    </div>
                  )}
                </td>
              </tr>

              {/* Mobile View */}
              <tr className="d-block d-md-none p-3 position-relative">
                <td>
                  <div className="d-flex border-bottom">
                    <div onClick={detailsRedirect}>{Pic}</div>
                    <div className="flex-grow-1 ml-3" onClick={detailsRedirect}>
                      <h6 className="mb-0 fz-14">{record.name}</h6>
                      <p className="mb-2">{record.shortName}</p>
                    </div>
                    <div className="card-right-icon">
                      <div className="dropdown">
                        <div className="btn-group dropleft">
                          <button
                            type="button"
                            className="dropdown-toggle bg-transparent border-0 text-light"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <BiDotsVerticalRounded />
                          </button>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="dropdownoption"
                          >
                            {editAllowed && (
                              <Fragment>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    blockUnblockRow(
                                      record.id,
                                      !record.isActive
                                    );
                                  }}
                                >
                                  {!record.isActive ? 'Activate' : 'InActivate'}
                                </button>

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
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="mt-2 mb-0">
                      {' '}
                      <span className="text-muted">Status : </span>{' '}
                      {record.isActive ? 'Active' : 'InActive'}
                    </p>
                  </div>
                </td>
              </tr>
            </Fragment>
          );
        })}
      </>
    );
  };

  return (
    <Main sideBarId={PropertiesRoutes.routes.list.sideBarId}>
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
          <p>Are you sure you want to delete the property?</p>
        </div>
      </Popup>

      <div className={viewType === 'list' ? 'list-in mx-4' : 'grid-in mx-4'}>
        <div className="main-heading-wrap flex-space-between ipad-flex-wrap mb-4">
          <div className="dashboard-heading-title d-flex ipad-w-100">
            <h5 className="title">{PropertiesRoutes.name}</h5>
            <div className="btn-wrap ml-auto d-lg-none mobile-d-none">
              {propertiesPermissions.add && (
                <Link
                  className="btn btn-primary"
                  to={PropertiesRoutes.routes.add.path}
                  title="Add New"
                >
                  <PolyfillAddIcon className="mr-2" />
                  Add New
                </Link>
              )}
            </div>
          </div>
          <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0">
            <form
              className="d-none d-md-inline ml-auto"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <div className="form-group ipad-mr-0">
                <TextInputComp
                  name="searchFilter"
                  type="text"
                  className="form-control"
                  placeholder="Search Properties"
                  onChange={setSearchFilter}
                  value={searchFilter}
                />
                <i className="fas fa-search" />
              </div>
            </form>

            <div className="btn-wrap ipad-d-none">
              {propertiesPermissions.add && (
                <Link
                  className="btn btn-primary"
                  to={PropertiesRoutes.routes.add.path}
                  title="Add New"
                >
                  <PolyfillAddIcon className="mr-2" />
                  Add New
                </Link>
              )}
            </div>
          </div>
        </div>
        {searchToggle && isMobile && (
          <div className="property-search-box">
            <TextInputComp
              name="searchFilter"
              type="text"
              className="form-control"
              placeholder="Search Properties"
              onChange={setSearchFilter}
              value={searchFilter}
            />
            <i className="fas fa-search" />
          </div>
        )}

        {/* Mobile View Only */}
        <div className="grid-list-icon d-md-none d-flex w-100 job-mobile-icon">
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

          <div className="flex-content ml-auto">
            <div
              className="search-icon"
              onClick={(e) => setSearchToggle(!searchToggle)}
            >
              <MagnifierIcon />
            </div>
          </div>
        </div>

        <div className="user-table-wrap job-table-wrap jobs-grid-table mobile-table">
          <div className="table-wrap overflow-auto">
            <table className="table ">
              {!isMobile && (
                <colgroup>
                  <col style={{ width: '5%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '40%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                </colgroup>
              )}

              <thead className="mobile-d-none">
                <tr>
                  <th />
                  <th scope="col">
                    <div
                      className="flex-content"
                      onClick={() => {
                        setSort({
                          ...sort,
                          name: sort.name === -1 ? 1 : -1,
                        });
                      }}
                    >
                      Name{'   '}
                      {sort.name === 1 ? (
                        <FaSortAmountUp className="ml-2" />
                      ) : (
                        <FaSortAmountDown className="ml-2" />
                      )}
                    </div>
                  </th>
                  <th scope="col">Address</th>
                  <th scope="col">
                    <div className="flex-content">Status</div>
                  </th>
                  <th scope="col">
                    <div className="flex-content">
                      CreatedAt
                      {sort.createdAt === 1 ? (
                        <FaSortAmountUp className="ml-2" />
                      ) : (
                        <FaSortAmountDown className="ml-2" />
                      )}
                    </div>
                  </th>

                  <th scope="col">
                    <div className="flex-content">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="px-2">{!isFetching && <RowsComponent />}</tbody>
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
