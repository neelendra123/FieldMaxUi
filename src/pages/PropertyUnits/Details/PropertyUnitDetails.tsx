import { useState, useEffect } from 'react';
import { useMountedState } from 'react-use';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { IModuleKind, IOption } from '../../../interfaces';

import { generateDynamicPath } from '../../../utils/common';

import { IAppReduxState } from '../../../redux/reducer';

import Main from '../../../components/Layouts/Main';
import {
  TextInputComp,
  SelectInputComp,
  TextAreaComp,
} from '../../../components/Forms';
import { IsFetching } from '../../../components/Common';

import { DefaultCommonAddress } from '../../Address/constants';

import { integrationCommonListAllService } from '../../IntegrationCommons/services';

import { userListAllService } from '../../Users/services';
import { IUserListAllRes } from '../../Users/interfaces';

import PropertyRoutes from '../../Properties/routes';
import { PropertiesCircleIcon2x } from '../../Properties/Icons';

import PropertyUnitRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

import PropertyUnitDeletePopup from '../Commons/PropertyUnitDeletePopup';

import TabGeneralInfo from './TabGeneralInfo';
import TabIntegrations from './TabIntegrations';
import TabAccess from './TabAccess';
import TabNotes from './TabNotes';
import TabJobs from './TabJobs';

export default function PropertyUnitDetails() {
  const isMounted = useMountedState();
  const params: { propertyId: string; propertyUnitId: string } = useParams();
  const history = useHistory();
  const { hash } = useLocation();

  const { authUser, accountIndex, accountsPermissions, accountsUserTypes } =
    useSelector((state: IAppReduxState) => state.auth);

  const [perms, setPerms] = useState(
    accountsPermissions[accountIndex].properties
  );
  const [tabPerms, setTabPerms] = useState<
    Record<interfaces.IPropertyUnitCreateUpdateTabsType, boolean>
  >({
    generalInfo: false,
    notes: false,
    access: false,
    jobs: false,
    integrations: false,
    timeLine: false,
  });

  const [isFetching, setIsFetching] = useState(false);

  const [activeTab, setActiveTab] =
    useState<interfaces.IPropertyUnitCreateUpdateTabsType>(
      (hash?.substring(1) as interfaces.IPropertyUnitCreateUpdateTabsType) ||
        interfaces.IPropertyUnitCreateUpdateTabsType.generalInfo
    );

  const [record, setRecord] =
    useState<interfaces.IPropertyUnitDetailsPopulated>({
      ...constants.DefaultPropertyUnitCreateEdit,
      id: params.propertyUnitId,
      propertyId: params.propertyId,
      pic: '',
      jobs: [],
      notes: [],
      unitTypes: [],
      primaryAddress: { ...DefaultCommonAddress, name: 'Primary' },
      isDefault: false,
      isActive: true,
      isDeleted: false,
      createdAt: '',
      updatedAt: '',
    });

  const [unitTypes, setUnitTypes] = useState<IOption[]>([]);

  //  Tab Access
  const [accountUsers, setAccountUsers] = useState<IUserListAllRes[]>([]);

  const [deleteId, setDeleteId] = useState('');

  const fetchData = async () => {
    setIsFetching(true);

    try {
      const [details, usersAll, intCommons] = await Promise.all([
        services.propertyUnitDetailsService(params.propertyUnitId, {
          populateJobs: true,
        }),
        userListAllService({ moduleKind: IModuleKind.properties }),
        integrationCommonListAllService(),
      ]);

      if (!isMounted()) {
        return;
      }

      setRecord({ ...details });
      setAccountUsers(usersAll);

      //  Unit Types
      const newUnitTypes: IOption[] = [];
      intCommons.unitTypes.forEach((unitType) => {
        if (details.unitTypes.indexOf(unitType.id) !== -1) {
          newUnitTypes.push({
            label: unitType.name,
            value: unitType.id,
          });
        }
      });
      setUnitTypes(newUnitTypes);
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
  };

  useEffect(() => {
    //  This is to get owner view Permission at org level
    setPerms(accountsPermissions[accountIndex].properties);
  }, [authUser, accountIndex, accountsPermissions]);

  useEffect(() => {
    //  This set the tabs permissions
    setTabPerms({
      ...tabPerms,
      generalInfo:
        perms.generalInfo.all ||
        perms.generalInfo.view ||
        perms.generalInfo.edit,
      jobs: perms.jobs.all || perms.jobs.view || perms.jobs.edit,
      access: perms.access.all || perms.access.view || perms.access.edit,
      notes: perms.notes.all || perms.notes.view || perms.notes.edit,
      integrations:
        perms.integrations.all ||
        perms.integrations.view ||
        perms.integrations.edit,
      timeLine: false,
    });
  }, [perms]);

  useEffect(() => {
    fetchData();
  }, []);

  const skipPermCheck =
    accountsUserTypes[accountIndex].isAdmin ||
    accountsUserTypes[accountIndex].isOwner ||
    accountsUserTypes[accountIndex].isSuperAdmin;

  const editAllowed =
    skipPermCheck ||
    ((perms.base.all || perms.base.edit) &&
      (record.access.all || record.access.users.indexOf(authUser.id) != -1));

  const deleteAllowed =
    skipPermCheck ||
    ((perms.base.all || perms.base.delete) &&
      (record.access.all || record.access.users.indexOf(authUser.id) != -1));

  return (
    <Main sideBarId={PropertyRoutes.sidebarId}>
      {isFetching && <IsFetching />}

      <PropertyUnitDeletePopup
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        callBackEffect={async () => {
          try {
            if (!isMounted()) {
              return;
            }

            await fetchData();

            const path = generateDynamicPath(
              PropertyRoutes.routes.details.path,
              {
                propertyId: params.propertyId,
              }
            );

            history.goBack ? history.goBack() : history.push(path);
          } catch (error) {
            console.error(error);
          }

          if (!isMounted()) {
            return;
          }
          setDeleteId('');
        }}
      />

      <div className="px-lg-0 px-3">
        <div className="create-property-wrap">
          <div className="flex-space-between-wrap mb-4 py-2 pt-4 align-items-center">
            <div className="dashboard-heading-title">
              <h6 className="title">{record.name}</h6>
            </div>

            <div className="mobile-d-none">
              <div className="dropleft">
                <button
                  type="button"
                  className="btn btn-primary dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <BsThreeDotsVertical />
                  Options
                </button>
                <div className="dropdown-menu">
                  {editAllowed && !record.isDeleted && (
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        const path = generateDynamicPath(
                          PropertyUnitRoutes.routes.edit.path,
                          {
                            propertyId: params.propertyId,
                            propertyUnitId: params.propertyUnitId,
                          }
                        );

                        history.push(path);
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {deleteAllowed && !record.isDefault && !record.isDeleted && (
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => setDeleteId(params.propertyUnitId)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center justify-content-lg-start">
            <div className="position-relative d-inline">
              {record.picURL ? (
                <img
                  className="account-user-img"
                  src={record.picURL}
                  alt={record.name}
                  title={record.name}
                />
              ) : (
                <PropertiesCircleIcon2x />
              )}
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <TextInputComp
                name="name"
                placeholder="Name"
                value={record.name}
                label="Name *"
                labelClassName="d-none d-md-block"
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <SelectInputComp
                name="unitTypes"
                label="Unit Types *"
                labelClassName="mb-2 font-weight-bold"
                placeholder="Unit Types *"
                value={unitTypes}
                options={unitTypes}
                isDisabled
                isMulti
              />
            </div>

            <div className="col-md-6 mb-3">
              <TextInputComp
                type="number"
                name="bathrooms"
                id="bathrooms"
                label="Bathrooms"
                placeholder="Bathrooms"
                value={record.bathrooms}
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <TextInputComp
                type="number"
                name="bedrooms"
                id="bedrooms"
                label="Bedrooms"
                placeholder="Bedrooms"
                value={record.bedrooms}
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <TextInputComp
                type="number"
                name="squareFootage"
                id="squareFootage"
                label="Total Sq. Foot"
                placeholder="Total Sq. Foot"
                value={record.squareFootage}
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <TextAreaComp
                name="comments"
                label="Comments"
                placeholder="Comments"
                value={record.comments}
                disabled
              />
            </div>
          </div>

          <div className="d-flex overflow-auto flex-nowwrap mt-3">
            {tabPerms.generalInfo && (
              <div
                onClick={() => {
                  const newActiveTab =
                    interfaces.IPropertyUnitCreateUpdateTabsType.generalInfo;

                  setActiveTab(newActiveTab);
                  window.history.pushState('', '', `#${newActiveTab}`);
                }}
                className={`max-checkbox mr-4 c-pointer ${
                  activeTab ===
                  interfaces.IPropertyUnitCreateUpdateTabsType.generalInfo
                    ? 'active-check'
                    : ''
                }`}
              >
                <h6 className="check-h-text">General Info</h6>
              </div>
            )}

            {tabPerms.notes && (
              <div
                onClick={() => {
                  const newActiveTab =
                    interfaces.IPropertyUnitCreateUpdateTabsType.notes;

                  setActiveTab(newActiveTab);
                  window.history.pushState('', '', `#${newActiveTab}`);
                }}
                className={`max-checkbox mr-4 c-pointer ${
                  activeTab ===
                  interfaces.IPropertyUnitCreateUpdateTabsType.notes
                    ? 'active-check'
                    : ''
                }`}
              >
                <h6 className="check-h-text">Notes & History</h6>
              </div>
            )}

            <div
              onClick={() => {
                const newActiveTab =
                  interfaces.IPropertyUnitCreateUpdateTabsType.jobs;

                setActiveTab(newActiveTab);
                window.history.pushState('', '', `#${newActiveTab}`);
              }}
              className={`max-checkbox mr-4 c-pointer ${
                activeTab === interfaces.IPropertyUnitCreateUpdateTabsType.jobs
                  ? 'active-check'
                  : ''
              }`}
            >
              <h6 className="check-h-text">Jobs</h6>
            </div>

            {tabPerms.access && (
              <div
                onClick={() => {
                  const newActiveTab =
                    interfaces.IPropertyUnitCreateUpdateTabsType.access;

                  setActiveTab(newActiveTab);
                  window.history.pushState('', '', `#${newActiveTab}`);
                }}
                className={`max-checkbox mr-4 c-pointer ${
                  activeTab ===
                  interfaces.IPropertyUnitCreateUpdateTabsType.access
                    ? 'active-check'
                    : ''
                }`}
              >
                <h6 className="check-h-text">Access</h6>
              </div>
            )}

            {tabPerms.integrations && (
              <div
                onClick={() => {
                  const newActiveTab =
                    interfaces.IPropertyUnitCreateUpdateTabsType.integrations;

                  setActiveTab(newActiveTab);
                  window.history.pushState('', '', `#${newActiveTab}`);
                }}
                className={`max-checkbox mr-4 c-pointer ${
                  activeTab ===
                  interfaces.IPropertyUnitCreateUpdateTabsType.integrations
                    ? 'active-check'
                    : ''
                }`}
              >
                <h6 className="check-h-text">Integrations</h6>
              </div>
            )}
          </div>

          {activeTab ===
            interfaces.IPropertyUnitCreateUpdateTabsType.generalInfo &&
            tabPerms.generalInfo && (
              <TabGeneralInfo
                addresses={[record.primaryAddress, ...record.addresses]}
              />
            )}

          {activeTab === interfaces.IPropertyUnitCreateUpdateTabsType.jobs && (
            <TabJobs jobs={record.jobs} />
          )}

          {activeTab === interfaces.IPropertyUnitCreateUpdateTabsType.access &&
            tabPerms.access && (
              <TabAccess access={record.access} accountUsers={accountUsers} />
            )}

          {activeTab === interfaces.IPropertyUnitCreateUpdateTabsType.notes &&
            tabPerms.notes && (
              <TabNotes
                propertyId={record.propertyId}
                propertyUnitId={params.propertyUnitId}
              />
            )}

          {activeTab ===
            interfaces.IPropertyUnitCreateUpdateTabsType.integrations &&
            tabPerms.integrations && <TabIntegrations rm={record.rm} />}
        </div>
      </div>
    </Main>
  );
}
