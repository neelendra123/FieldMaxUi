import { Fragment, useEffect, useState } from 'react';
import { useMountedState } from 'react-use';
import { useLocation } from 'react-router-dom';

import { ICommonSort } from '../../../interfaces';

import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';
import { BiDotsVerticalRounded, BiPencil } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';

import { successToast } from '../../../utils/toast';

import Main from '../../../components/Layouts/Main';
import {
  // Pagination,
  DefaultTablePageLimits,
} from '../../../components/Common/Pagination/Pagination';
import { IsFetching, Popup } from '../../../components/Common';
import { TextInputComp } from '../../../components/Forms';
import { MagnifierIcon, PolyfillAddIcon } from '../../../components/Icons';

import {
  IIntegrationCommonSubModuleTypes,
  IIntegrationCommonSubModulePerms,
} from '../../Orgs/interfaces';

import { IntegrationCommonIconCircle } from '../Icons';
import { IntegrationCommonsAdd, IntegrationCommonEdit } from '../index';
import IntegrationCommonRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as services from '../services';

export default function IntegrationCommonList() {
  const { hash } = useLocation();
  const isMounted = useMountedState();

  const [isLoaded, setIsLoaded] = useState(false); // For Skeleton
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  //////////////////////////
  //  //  //  //  //  New
  //////////////////////////

  const [selectedTab, setSelectedTab] =
    useState<IIntegrationCommonSubModuleTypes>(
      (hash?.substring(1) as IIntegrationCommonSubModuleTypes) ||
        IIntegrationCommonSubModuleTypes.serviceManagerCategories
    );

  //  Filters
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [sortKey, setSortKey] = useState<'name'>('name');
  const [sort, setSort] = useState<ICommonSort>({
    name: 1,
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DefaultTablePageLimits[0]);

  const [counts, setCounts] = useState<IIntegrationCommonSubModulePerms>({
    base: 0,

    propertyTypes: 0,
    addressTypes: 0,
    chargeTypes: 0,

    unitTypes: 0,

    serviceManagerCategories: 0,
    serviceManagerPriorities: 0,
    serviceManagerStatuses: 0,
  });
  const [list, setList] = useState<interfaces.IIntegrationCommonTypes[]>([]);

  const [addPopup, setAddPopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [editIndex, setEditIndex] = useState(-1);

  const fetchData = async () => {
    setIsLoaded(false);

    try {
      const result = await services.integrationCommonListService(selectedTab, {
        skip: (page - 1) * perPage,
        limit: perPage,
        sort,
        search: searchFilter,
      });

      if (!isMounted()) {
        return;
      }

      setCounts(result.count);
      setList(result.list);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsLoaded(true);
  };

  const blockUnblock = async (
    integrationCommonId: string,
    isActive: boolean
  ) => {
    setIsLoaded(false);

    try {
      const result = await services.integrationCommonBlockUnblockService(
        selectedTab,
        integrationCommonId,
        isActive
      );
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
  }, [selectedTab, sort, searchFilter, page]);

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

  const SearchBoxComp = ({ placeholder }: { placeholder: string }) => {
    return (
      <form className="ml-auto tab-search-form-sm mr-2">
        <div className="form-group mr-md-0">
          <TextInputComp
            name="searchFilter"
            type="text"
            className="form-control"
            placeholder={placeholder}
            onChange={setSearchFilter}
            value={searchFilter}
          />
          <i className="fas fa-search" />
        </div>
      </form>
    );
  };

  const RowsComp = () => {
    return (
      <>
        {list.map((integrationCommon, index: number) => {
          return (
            <Fragment key={integrationCommon.id}>
              {isMobile ? (
                <tr>
                  <td>
                    <div className="d-flex border-bottom">
                      <div>
                        <IntegrationCommonIconCircle />
                      </div>
                      <div className="flex-grow-1 ml-3">
                        <h6 className="mb-0 fz-14">{integrationCommon.name}</h6>
                        <p className="mb-2">{integrationCommon.description}</p>
                      </div>
                      {!integrationCommon.isGlobal && (
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
                              <div className="dropdown-menu">
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={() => {
                                    setEditIndex(index);
                                  }}
                                >
                                  Edit{' '}
                                </button>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={() => {
                                    setDeleteIndex(index);
                                  }}
                                >
                                  Delete
                                </button>

                                <div
                                  onClick={() => {
                                    blockUnblock(
                                      integrationCommon.id,
                                      !integrationCommon.isActive
                                    );
                                  }}
                                >
                                  {integrationCommon.isActive ? (
                                    <button
                                      className="dropdown-item"
                                      type="button"
                                    >
                                      InActivate
                                    </button>
                                  ) : (
                                    <button
                                      className="dropdown-item"
                                      type="button"
                                    >
                                      Activate
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="mt-2 mb-0">
                        <span className="text-muted">Status : </span>{' '}
                        {integrationCommon.isActive ? 'Active' : 'InActive'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="ml-3">
                    <IntegrationCommonIconCircle />
                  </td>
                  <td>{integrationCommon.name}</td>
                  <td>{integrationCommon.description}</td>
                  <td>
                    {integrationCommon.isActive ? (
                      <button className="active-btn">Active</button>
                    ) : (
                      <button className="inactive-btn">InActive</button>
                    )}
                  </td>
                  <td>
                    {!integrationCommon.isGlobal && (
                      <Fragment>
                        <div
                          className="light-icon mr-2"
                          onClick={() => setEditIndex(index)}
                        >
                          <BiPencil />
                        </div>

                        <div
                          className="light-icon px-2 pt-1 mr-2"
                          onClick={() => {
                            blockUnblock(
                              integrationCommon.id,
                              !integrationCommon.isActive
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{ display: 'none' }}
                            id={`${integrationCommon.id}-isActive`}
                            checked={integrationCommon.isActive}
                            onChange={(event) => {
                              event.preventDefault();
                            }}
                          />

                          <label
                            className="switch mb-0"
                            htmlFor={`${integrationCommon.id}-isActive`}
                          />
                        </div>

                        {/* <div className="light-icon px-2 pt-1 mr-2">
                          <input
                            type="checkbox"
                            style={{ display: 'none' }}
                            id={`propertyType-${integrationCommon.id}`}
                            onChange={(event) => {
                              event.preventDefault();
                            }}
                            value={integrationCommon.isActive ? 1 : 0}
                          />
                          <label
                            className="switch mb-0"
                            htmlFor={`propertyType-${integrationCommon.id}`}
                          />
                        </div> */}
                        <div
                          className="light-icon"
                          onClick={() => setDeleteIndex(index)}
                        >
                          <AiOutlineDelete />
                        </div>
                      </Fragment>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </>
    );
  };

  const AddButtonComp = () => {
    if (selectedTab === IIntegrationCommonSubModuleTypes.propertyTypes) {
      return null;
    }

    return (
      <button
        onClick={() => setAddPopup(true)}
        className="dropdown-toggle btn btn-primary option-btn-primary flex-content"
        title="Add New"
      >
        <PolyfillAddIcon className="mr-2" />
        Add New
      </button>
    );
  };

  const DeletePopupComp = () => {
    const [isDeleting, setIsDeleting] = useState(false);

    const onSave = async () => {
      try {
        setIsDeleting(true);

        const result = await services.integrationCommonDeleteService(
          selectedTab,
          list[deleteIndex].id
        );

        successToast(result.message);

        if (!isMounted()) {
          return;
        }

        setDeleteIndex(-1);

        fetchData();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Fragment>
        <Popup
          isOpen={deleteIndex !== -1}
          title={'Delete Confirmation'}
          hideButton={false}
          onClose={() => setDeleteIndex(-1)}
          leftItem={'Cancel'}
          leftFunction={() => setDeleteIndex(-1)}
          onSave={onSave}
          ModalName={'Delete'}
          addClassToWrapper="card-media-box"
          leftItemViewOnlyClass="flex-space-center"
          disableButtons={isDeleting}
        >
          <div className="sec-content">
            <p>Are you sure you want to delete?</p>
          </div>
        </Popup>
      </Fragment>
    );
  };

  return (
    <Main
      sideBarId={IntegrationCommonRoutes.routes.integrationCommonList.sideBarId}
    >
      {addPopup || deleteIndex !== -1 || editIndex !== -1
        ? (document.body.className = 'fixed-position')
        : (document.body.className = '')}

      {!isLoaded && <IsFetching />}

      <IntegrationCommonsAdd
        selectedTab={selectedTab}
        addPopup={addPopup}
        setAddPopup={setAddPopup}
        addEffect={() => {
          fetchData();
        }}
      />
      <IntegrationCommonEdit
        selectedTab={selectedTab}
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        updateEffect={() => {
          fetchData();
        }}
        integrationCommon={list[editIndex]}
      />

      <DeletePopupComp />

      <div className="grid-in mx-0">
        <div className="main-heading-wrap flex-space-between ipad-flex-wrap mb-4">
          <div className="dashboard-heading-title d-flex justify-content-md-between ipad-w-100">
            <h5 className="title">{IntegrationCommonRoutes.name}</h5>
          </div>
          {isMobile && <AddButtonComp />}
        </div>

        <div className="plumbing-tab-wrap">
          <div className="tab-sec-wrap">
            <div className="tab-sec-content">
              <div className="flex-space-between mb-4 auto-overflow">
                <ul
                  className="nav nav-pills mb-md-0 mb-3"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <a
                      className={
                        selectedTab ===
                        IIntegrationCommonSubModuleTypes.serviceManagerCategories
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      onClick={() => {
                        setPage(1);
                        setSelectedTab(
                          IIntegrationCommonSubModuleTypes.serviceManagerCategories
                        );
                        window.history.pushState(
                          '',
                          '',
                          `#${IIntegrationCommonSubModuleTypes.serviceManagerCategories}`
                        );
                      }}
                      id={
                        IIntegrationCommonSubModuleTypes.serviceManagerCategories
                      }
                      data-toggle="pill"
                      href={`#${IIntegrationCommonSubModuleTypes.serviceManagerCategories}`}
                      role="tab"
                      aria-controls={`${IIntegrationCommonSubModuleTypes.serviceManagerCategories}`}
                      aria-selected={
                        selectedTab ===
                        IIntegrationCommonSubModuleTypes.serviceManagerCategories
                          ? 'true'
                          : 'false'
                      }
                    >
                      Categories ({counts.serviceManagerCategories})
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      className={
                        selectedTab ===
                        IIntegrationCommonSubModuleTypes.serviceManagerStatuses
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      onClick={() => {
                        setPage(1);
                        setSelectedTab(
                          IIntegrationCommonSubModuleTypes.serviceManagerStatuses
                        );
                        window.history.pushState(
                          '',
                          '',
                          `#${IIntegrationCommonSubModuleTypes.serviceManagerStatuses}`
                        );
                      }}
                      id={
                        IIntegrationCommonSubModuleTypes.serviceManagerStatuses
                      }
                      data-toggle="pill"
                      href={`#${IIntegrationCommonSubModuleTypes.serviceManagerStatuses}`}
                      role="tab"
                      aria-controls={
                        IIntegrationCommonSubModuleTypes.serviceManagerStatuses
                      }
                      aria-selected={
                        selectedTab ===
                        IIntegrationCommonSubModuleTypes.serviceManagerStatuses
                          ? 'true'
                          : 'false'
                      }
                    >
                      Statuses ({counts.serviceManagerStatuses})
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      className={
                        selectedTab ===
                        IIntegrationCommonSubModuleTypes.serviceManagerPriorities
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      onClick={() => {
                        setPage(1);
                        setSelectedTab(
                          IIntegrationCommonSubModuleTypes.serviceManagerPriorities
                        );
                        window.history.pushState(
                          '',
                          '',
                          `#${IIntegrationCommonSubModuleTypes.serviceManagerPriorities}`
                        );
                      }}
                      id={
                        IIntegrationCommonSubModuleTypes.serviceManagerPriorities
                      }
                      data-toggle="pill"
                      href={`#${IIntegrationCommonSubModuleTypes.serviceManagerPriorities}`}
                      role="tab"
                      aria-controls={
                        IIntegrationCommonSubModuleTypes.serviceManagerPriorities
                      }
                      aria-selected="false"
                    >
                      Priorities ({counts.serviceManagerPriorities})
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      className={
                        selectedTab ===
                        IIntegrationCommonSubModuleTypes.chargeTypes
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      onClick={() => {
                        setPage(1);
                        setSelectedTab(
                          IIntegrationCommonSubModuleTypes.chargeTypes
                        );

                        window.history.pushState(
                          '',
                          '',
                          `#${IIntegrationCommonSubModuleTypes.chargeTypes}`
                        );
                      }}
                      id={IIntegrationCommonSubModuleTypes.chargeTypes}
                      data-toggle="pill"
                      href={`#${IIntegrationCommonSubModuleTypes.chargeTypes}`}
                      role="tab"
                      aria-controls={
                        IIntegrationCommonSubModuleTypes.chargeTypes
                      }
                      aria-selected="false"
                    >
                      Charge Types ({counts.chargeTypes})
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      className={
                        selectedTab ===
                        IIntegrationCommonSubModuleTypes.propertyTypes
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      onClick={() => {
                        setPage(1);
                        setSelectedTab(
                          IIntegrationCommonSubModuleTypes.propertyTypes
                        );

                        window.history.pushState(
                          '',
                          '',
                          `#${IIntegrationCommonSubModuleTypes.propertyTypes}`
                        );
                      }}
                      id={IIntegrationCommonSubModuleTypes.propertyTypes}
                      data-toggle="pill"
                      href={`#${IIntegrationCommonSubModuleTypes.propertyTypes}`}
                      role="tab"
                      aria-controls={
                        IIntegrationCommonSubModuleTypes.propertyTypes
                      }
                      aria-selected="false"
                    >
                      Property Types ({counts.propertyTypes})
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      className={
                        selectedTab ===
                        IIntegrationCommonSubModuleTypes.unitTypes
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                      onClick={() => {
                        setPage(1);
                        setSelectedTab(
                          IIntegrationCommonSubModuleTypes.unitTypes
                        );

                        window.history.pushState(
                          '',
                          '',
                          `#${IIntegrationCommonSubModuleTypes.unitTypes}`
                        );
                      }}
                      id={IIntegrationCommonSubModuleTypes.unitTypes}
                      data-toggle="pill"
                      href={`#${IIntegrationCommonSubModuleTypes.unitTypes}`}
                      role="tab"
                      aria-controls={IIntegrationCommonSubModuleTypes.unitTypes}
                      aria-selected="false"
                    >
                      Unit Types ({counts.unitTypes})
                    </a>
                  </li>
                </ul>
                {!isMobile && (
                  <Fragment>
                    <SearchBoxComp placeholder="Search" />
                    <AddButtonComp />
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>

        {isMobile && showMobileSearch && <SearchBoxComp placeholder="Search" />}

        <div className="grid-list-icon d-md-none d-flex w-100 job-mobile-icon">
          <div className="pull-left">
            <select
              className="form-control"
              value={sortKey}
              onChange={(event) => {
                const value = event.target.value;
                //@ts-ignore
                setSortKey(value);

                setSort({
                  [value]: sort[value] || 1,
                });
              }}
            >
              <option value="title">Title</option>
              <option value="endDt">Due Date</option>
            </select>
          </div>

          <div className="grid-list-icon flex-content ml-auto primary-icon">
            <button
              className={
                sort[sortKey] === 1
                  ? `active-icon down-sort border-0 bg-transparent`
                  : 'down-sort border-0 bg-transparent'
              }
              onClick={() => {
                setSort({
                  ...sort,
                  [sortKey]: 1,
                });
              }}
            >
              <FaSortAmountDown />
            </button>
            <button
              className={
                sort[sortKey] === -1
                  ? `active-icon down-sort border-0 bg-transparent`
                  : 'down-sort border-0 bg-transparent'
              }
              onClick={() => {
                setSort({
                  ...sort,
                  [sortKey]: -1,
                });
              }}
            >
              <FaSortAmountUp />
            </button>

            <button
              className="border-0 bg-transparent"
              onClick={() => {
                setShowMobileSearch(!showMobileSearch);
              }}
            >
              <MagnifierIcon />
            </button>
          </div>
        </div>

        <div className="user-table-wrap job-table-wrap jobs-grid-table mobile-table">
          <div className="table-wrap">
            <table className="table">
              <thead className="mobile-d-none">
                <tr className="shadow-none">
                  <th></th>
                  <th scope="col">
                    <div
                      className="flex-content"
                      onClick={() => {
                        setSortKey('name');
                        setSort({
                          // ...sort,
                          name: sort.name === 1 ? -1 : 1,
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
                  <th scope="col">
                    <div className="flex-content">Description</div>
                  </th>
                  <th scope="col">
                    <div className="flex-content">Status</div>
                  </th>

                  <th scope="col">
                    <div className="flex-content">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody>{isLoaded && <RowsComp />}</tbody>
            </table>

            {/* {isLoaded && (
              <Pagination
                totalRows={counts[selectedTab]}
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            )} */}
          </div>
        </div>
      </div>
    </Main>
  );
}
