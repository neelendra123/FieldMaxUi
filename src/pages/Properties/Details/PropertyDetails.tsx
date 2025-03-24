import { useState, useEffect } from 'react';
import { useMountedState } from 'react-use';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { IModuleKind, IOption } from '../../../interfaces';

import { IAppReduxState } from '../../../redux/reducer';

import { generateDynamicPath } from '../../../utils/common';

import Main from '../../../components/Layouts/Main';
import {
  TextInputComp,
  SelectInputComp,
  TextAreaComp,
} from '../../../components/Forms';
import { IsFetching } from '../../../components/Common';
import { EditIcons } from '../../../components/Icons';

import { integrationCommonListAllService } from '../../IntegrationCommons/services';

import { IUserListAllRes } from '../../Users/interfaces';
import { userListAllService } from '../../Users/services';

import { PropertiesCircleIcon2x } from '../Icons';
import PropertiesRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

import TabGeneralInfo from './TabGeneralInfo';
import TabNotes from './TabNotes';
import TabAccess from './TabAccess';
import TabOwners from './TabOwners';
import TabPropertyUnits from './TabPropertyUnits';
import TabIntegrations from './TabIntegrations';
import TabJobs from './TabJobs';

export default function PropertyDetails() {
  const isMounted = useMountedState();
  const params: { propertyId: string } = useParams();
  const history = useHistory();
  const { hash } = useLocation();

  const { authUser, accountIndex, accountsPermissions, accountsUserTypes } =
    useSelector((state: IAppReduxState) => state.auth);

  const [perms, setPerms] = useState(
    accountsPermissions[accountIndex].properties
  );
  const [tabPerms, setTabPerms] = useState<
    Record<interfaces.IPropertyCreateUpdateTabsType, boolean>
  >({
    generalInfo: false,
    userOwners: false,
    propertyUnits: false,
    notes: false,
    jobs: false,
    access: false,
    integrations: false,
    timeLine: false,
  });

  const [isFetching, setIsFetching] = useState(false);

  const [activeTab, setActiveTab] =
    useState<interfaces.IPropertyCreateUpdateTabsType>(
      (hash?.substring(1) as interfaces.IPropertyCreateUpdateTabsType) ||
        interfaces.IPropertyCreateUpdateTabsType.generalInfo
    );

  const [record, setRecord] = useState<interfaces.IPropertyDetailsPopulated>({
    ...constants.DefaultUserOwnerCreateEdit,
    id: params.propertyId,
    userOwners: [],
    propertyUnits: [],
    jobs: [],
  });

  const [propertyTypes, setPropertyTypes] = useState<IOption[]>([]);
  const [chargeTypes, setChargeTypes] = useState<IOption[]>([]);

  //  Tab Access
  const [accountUsers, setAccountUsers] = useState<IUserListAllRes[]>([]);

  const fetchData = async () => {
    setIsFetching(true);

    try {
      const [propertyDetails, usersAll, intCommons] = await Promise.all([
        services.propertyDetailsService(params.propertyId, {
          populateUserOwners: true,
          populatePropertyUnits: true,
          populateJobs: true,
        }),
        userListAllService({
          moduleKind: IModuleKind.properties,
        }),
        integrationCommonListAllService(),
      ]);

      if (!isMounted()) {
        return;
      }

      setRecord(propertyDetails);
      setAccountUsers(usersAll);

      //  Property Types
      const newPropertyTypes: IOption[] = [];
      intCommons.propertyTypes.forEach((propertyType) => {
        if (propertyDetails.propertyTypes.indexOf(propertyType.id) !== -1) {
          newPropertyTypes.push({
            label: propertyType.name,
            value: propertyType.id,
          });
        }
      });
      setPropertyTypes(newPropertyTypes);

      //  Charge Types
      const newChargeTypes: IOption[] = [];
      intCommons.chargeTypes.forEach((chargeType) => {
        if (propertyDetails.chargeTypes.indexOf(chargeType.id) !== -1) {
          newChargeTypes.push({
            label: chargeType.name,
            value: chargeType.id,
          });
        }
      });
      setChargeTypes(newChargeTypes);
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
      userOwners:
        perms.userOwners.all || perms.userOwners.view || perms.userOwners.edit,
      propertyUnits:
        perms.propertyUnits.all ||
        perms.propertyUnits.view ||
        perms.propertyUnits.edit,
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

  // const unitDetailsAllowed =
  //   skipPermCheck ||
  //   ((perms.propertyUnits.all ||
  //     perms.propertyUnits.edit ||
  //     perms.propertyUnits.view) &&
  //     (record.access.all || record.access.users.indexOf(authUser.id) != -1));

  return (
    <Main sideBarId={PropertiesRoutes.routes.add.sideBarId}>
      {isFetching && <IsFetching />}

      <div className="mx-4">
        <div className="create-property-wrap">
          <div className="flex-space-between-wrap mb-4 py-2 pt-4 align-items-center">
            <h6 className="title mb-0">
              {record.name} {record.shortName ? `(${record.shortName})` : ''}{' '}
            </h6>

            <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0">
              {editAllowed && (
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const path = generateDynamicPath(
                        PropertiesRoutes.routes.edit.path,
                        {
                          propertyId: params.propertyId,
                        }
                      );

                      history.push(path);
                    }}
                    disabled={isFetching}
                  >
                    <EditIcons /> Edit Details
                  </button>
                </div>
              )}
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
                placeholder="Property Name"
                value={record.name}
                label="Property Name *"
                labelClassName="d-none d-md-block"
                disabled
              />
            </div>
            <div className="col-md-6 mb-3">
              <TextInputComp
                name="shortName"
                placeholder="Short Name *"
                value={record.shortName}
                label="Short Name *"
                labelClassName="d-none d-md-block"
                disabled
              />
            </div>
            <div className="col-md-6 mb-3">
              <SelectInputComp
                name="propertyTypes"
                label="Property Types *"
                labelClassName="mb-2 font-weight-bold"
                placeholder="Property Types *"
                value={propertyTypes}
                options={propertyTypes}
                isDisabled
                isMulti
              />
            </div>

            <div className="col-md-6 mb-3">
              <SelectInputComp
                name="chargeTypes"
                label="Charge Types *"
                labelClassName="mb-2 font-weight-bold"
                placeholder="Charge Types *"
                value={chargeTypes}
                options={chargeTypes}
                isMulti
                isDisabled
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
              <TextInputComp
                name="name"
                label="Tax ID"
                placeholder="Tax Id"
                value={record.taxId}
                disabled
              />
            </div>

            <div className="col-md-12">
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
                    interfaces.IPropertyCreateUpdateTabsType.generalInfo;

                  setActiveTab(newActiveTab);
                  window.history.pushState('', '', `#${newActiveTab}`);
                }}
                className={`max-checkbox mr-4 c-pointer ${
                  activeTab ===
                  interfaces.IPropertyCreateUpdateTabsType.generalInfo
                    ? 'active-check'
                    : ''
                }`}
              >
                <h6 className="check-h-text">General Info</h6>
              </div>
            )}

            {tabPerms.userOwners && (
              <div
                onClick={() => {
                  const newActiveTab =
                    interfaces.IPropertyCreateUpdateTabsType.userOwners;

                  setActiveTab(newActiveTab);
                  window.history.pushState('', '', `#${newActiveTab}`);
                }}
                className={`max-checkbox mr-4 c-pointer ${
                  activeTab ===
                  interfaces.IPropertyCreateUpdateTabsType.userOwners
                    ? 'active-check'
                    : ''
                }`}
              >
                <h6 className="check-h-text">Owners</h6>
              </div>
            )}

            {tabPerms.propertyUnits && (
              <div
                onClick={() => {
                  const newActiveTab =
                    interfaces.IPropertyCreateUpdateTabsType.propertyUnits;

                  setActiveTab(newActiveTab);
                  window.history.pushState('', '', `#${newActiveTab}`);
                }}
                className={`max-checkbox mr-4 c-pointer ${
                  activeTab ===
                  interfaces.IPropertyCreateUpdateTabsType.propertyUnits
                    ? 'active-check'
                    : ''
                }`}
              >
                <h6 className="check-h-text">Units</h6>
              </div>
            )}

            <div
              onClick={() => {
                const newActiveTab =
                  interfaces.IPropertyCreateUpdateTabsType.jobs;

                setActiveTab(newActiveTab);
                window.history.pushState('', '', `#${newActiveTab}`);
              }}
              className={`max-checkbox mr-4 c-pointer ${
                activeTab === interfaces.IPropertyCreateUpdateTabsType.jobs
                  ? 'active-check'
                  : ''
              }`}
            >
              <h6 className="check-h-text">Jobs</h6>
            </div>

            {tabPerms.notes && (
              <div
                onClick={() => {
                  const newActiveTab =
                    interfaces.IPropertyCreateUpdateTabsType.notes;

                  setActiveTab(newActiveTab);
                  window.history.pushState('', '', `#${newActiveTab}`);
                }}
                className={`max-checkbox mr-4 c-pointer ${
                  activeTab === interfaces.IPropertyCreateUpdateTabsType.notes
                    ? 'active-check'
                    : ''
                }`}
              >
                <h6 className="check-h-text">Notes & History</h6>
              </div>
            )}

            {tabPerms.access && (
              <div
                onClick={() => {
                  const newActiveTab =
                    interfaces.IPropertyCreateUpdateTabsType.access;

                  setActiveTab(newActiveTab);
                  window.history.pushState('', '', `#${newActiveTab}`);
                }}
                className={`max-checkbox mr-4 c-pointer ${
                  activeTab === interfaces.IPropertyCreateUpdateTabsType.access
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
                    interfaces.IPropertyCreateUpdateTabsType.integrations;

                  setActiveTab(newActiveTab);
                  window.history.pushState('', '', `#${newActiveTab}`);
                }}
                className={`max-checkbox mr-4 c-pointer ${
                  activeTab ===
                  interfaces.IPropertyCreateUpdateTabsType.integrations
                    ? 'active-check'
                    : ''
                }`}
              >
                <h6 className="check-h-text">Integrations</h6>
              </div>
            )}
          </div>

          {activeTab === interfaces.IPropertyCreateUpdateTabsType.generalInfo &&
            tabPerms.generalInfo && (
              <TabGeneralInfo
                addresses={[
                  record.primaryAddress,
                  record.billingAddress,
                  ...record.addresses,
                ]}
              />
            )}

          {activeTab ===
            interfaces.IPropertyCreateUpdateTabsType.userOwners && (
            <TabOwners userOwners={record.userOwners} />
          )}
          {activeTab ===
            interfaces.IPropertyCreateUpdateTabsType.propertyUnits && (
            <TabPropertyUnits
              propertyId={record.id}
              propertyUnits={record.propertyUnits}
            />
          )}
          {activeTab === interfaces.IPropertyCreateUpdateTabsType.jobs && (
            <TabJobs jobs={record.jobs} />
          )}

          {activeTab === interfaces.IPropertyCreateUpdateTabsType.access &&
            tabPerms.access && (
              <TabAccess access={record.access} accountUsers={accountUsers} />
            )}

          {activeTab === interfaces.IPropertyCreateUpdateTabsType.notes &&
            tabPerms.notes && <TabNotes propertyId={params.propertyId} />}

          {activeTab ===
            interfaces.IPropertyCreateUpdateTabsType.integrations &&
            tabPerms.integrations && <TabIntegrations rm={record.rm} />}
        </div>
      </div>
    </Main>
  );
}
