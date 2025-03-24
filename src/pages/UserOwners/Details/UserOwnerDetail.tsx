import { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useMountedState } from 'react-use';
import { useSelector } from 'react-redux';

import { IModuleKind } from '../../../interfaces';

import { IAppReduxState } from '../../../redux/reducer';

import { generateDynamicPath } from '../../../utils/common';

import Main from '../../../components/Layouts/Main';
import { IsFetching } from '../../../components/Common';
import { EditIcons, OwnerIcon } from '../../../components/Icons';
import { TextInputComp, TextAreaComp } from '../../../components/Forms';

import { IUserListAllRes } from '../../Users/interfaces';
import { userListAllService } from '../../Users/services';
import { formatUserName } from '../../Users/utils';

import { propertiesListAllService } from '../../Properties/services';

import UserOwnerRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

import TabGeneralInfo from './TabGeneralInfo';
import TabProperties from './TabProperties';
import TabAccess from './TabAccess';
import TabNotes from './TabNotes';
import TabIntegration from './TabIntegration';

export default function UserOwnerAdd() {
  const isMounted = useMountedState();
  const params: { userOwnerId: string } = useParams();
  const history = useHistory();
  const { hash } = useLocation();

  const { authUser, accountIndex, accountsPermissions } = useSelector(
    (state: IAppReduxState) => state.auth
  );

  const [perms, setPerms] = useState(
    accountsPermissions[accountIndex].userOwners
  );
  const [tabPerms, setTabPerms] = useState<
    Record<interfaces.IOwnerCreateUpdateTabsType, boolean>
  >({
    generalInfo: false,
    properties: false,
    notes: false,
    access: false,
    integrations: false,
    timeLine: false,
  });

  const [isFetching, setIsFetching] = useState(false);

  const [activeTab, setActiveTab] =
    useState<interfaces.IOwnerCreateUpdateTabsType>(
      (hash?.substring(1) as interfaces.IOwnerCreateUpdateTabsType) ||
        interfaces.IOwnerCreateUpdateTabsType.generalInfo
    );

  const [record, setUserOwner] = useState({
    ...constants.DefaultUserOwnerCreateEdit,
  });
  const [accountProperties, setAccountProperties] = useState<
    interfaces.IUserOwnerPropertiesListAll[]
  >([]);
  const [accountUsers, setAccountUsers] = useState<IUserListAllRes[]>([]);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const [userOwner, propertiesAll, usersAll] = await Promise.all([
        services.userOwnerDetailsService(params.userOwnerId),
        propertiesListAllService(),
        userListAllService({
          moduleKind: IModuleKind.userOwners,
        }),
      ]);

      if (!isMounted()) {
        return;
      }

      setUserOwner(userOwner);
      setAccountUsers(usersAll);

      ////////////////////
      //  This is to make Properties & Units Listing Pre Selected
      const userOwnerProperitesCache: Record<string, string[]> = {};
      userOwner.properties.forEach((userOwnerProperity) => {
        userOwnerProperitesCache[userOwnerProperity.propertyId] =
          userOwnerProperity.propertyUnits;
      });

      const newAccountProperties = propertiesAll.records.map((property) => {
        let isSelected =
          userOwnerProperitesCache[property.id] !== undefined ? true : false;
        let selectedUnits = isSelected
          ? userOwnerProperitesCache[property.id]
          : [];

        return {
          ...property,
          label: `${property.name} (${property.shortName})`,
          value: property.id,
          isSelected,
          showUnits: true,
          selectedUnits,
        };
      });
      setAccountProperties(newAccountProperties);
      ////////////////////
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
    setPerms(accountsPermissions[accountIndex].userOwners);
  }, [authUser, accountIndex, accountsPermissions]);

  useEffect(() => {
    //  This set the tabs permissions
    setTabPerms({
      ...tabPerms,
      generalInfo:
        perms.generalInfo.all ||
        perms.generalInfo.view ||
        perms.generalInfo.edit,
      properties:
        perms.properties.all || perms.properties.view || perms.properties.edit,
      access: perms.access.all || perms.access.view || perms.access.edit,
      notes: perms.notes.all || perms.notes.view || perms.notes.edit,
      integrations:
        perms.integrations.all ||
        perms.integrations.view ||
        perms.integrations.edit,
    });
  }, [perms]);

  useEffect(() => {
    fetchData();
  }, []);

  const name = formatUserName(record.firstName, record.lastName);

  return (
    <Main sideBarId={UserOwnerRoutes.routes.add.sideBarId}>
      {isFetching && <IsFetching />}

      <div className="px-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="dashboard-heading-title d-flex ipad-w-100">
            <h5 className="title mb-0">{name}</h5>
          </div>
          <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0">
            {(perms.base.all || perms.base.view) && (
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const path = generateDynamicPath(
                      UserOwnerRoutes.routes.edit.path,
                      {
                        userOwnerId: params.userOwnerId,
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
            <div className="owner-avatar">
              {record.picURL ? (
                <img
                  className="account-user-img"
                  src={record.picURL}
                  alt={name}
                  title={name}
                />
              ) : (
                <OwnerIcon />
              )}
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-6">
            <div className="form-group">
              <TextInputComp
                name="firstName"
                id="firstname"
                autoFocus
                placeholder="First Name"
                value={record.firstName}
                label="First Name"
                labelClassName="d-none d-md-block"
                disabled
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <TextInputComp
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                value={record.lastName}
                label="Last Name"
                labelClassName="d-none d-md-block"
                disabled
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <TextInputComp
                name="email"
                id="email"
                placeholder="Email"
                value={record.email || ''}
                label="Email"
                labelClassName="d-none d-md-block"
                disabled
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <TextInputComp
                name="taxId"
                id="taxId"
                placeholder="Tax ID"
                value={record.taxId}
                label="Tax ID"
                labelClassName="d-none d-md-block"
                disabled
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <TextAreaComp
                name="comments"
                id="comments"
                value={record.comments}
                placeholder="Comments"
                label="Comments"
                labelClassName="d-none d-md-block"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="d-flex overflow-auto flex-nowwrap mt-3">
          {tabPerms.generalInfo && (
            <div
              onClick={() => {
                if (isFetching) {
                  return;
                }

                const newActiveTab =
                  interfaces.IOwnerCreateUpdateTabsType.generalInfo;

                setActiveTab(newActiveTab);
                window.history.pushState('', '', `#${newActiveTab}`);
              }}
              className={`max-checkbox mr-4 c-pointer ${
                activeTab === interfaces.IOwnerCreateUpdateTabsType.generalInfo
                  ? 'active-check'
                  : ''
              }`}
            >
              <h6 className="check-h-text">General Info</h6>
            </div>
          )}

          {tabPerms.properties && (
            <div
              onClick={() => {
                if (isFetching) {
                  return;
                }

                const newActiveTab =
                  interfaces.IOwnerCreateUpdateTabsType.properties;

                setActiveTab(newActiveTab);
                window.history.pushState('', '', `#${newActiveTab}`);
              }}
              className={`max-checkbox mr-4 c-pointer ${
                activeTab === interfaces.IOwnerCreateUpdateTabsType.properties
                  ? 'active-check'
                  : ''
              }`}
            >
              <h6 className="check-h-text">Properties</h6>
            </div>
          )}

          {tabPerms.notes && (
            <div
              onClick={() => {
                if (isFetching) {
                  return;
                }

                const newActiveTab =
                  interfaces.IOwnerCreateUpdateTabsType.notes;

                setActiveTab(newActiveTab);
                window.history.pushState('', '', `#${newActiveTab}`);
              }}
              className={`max-checkbox mr-4 c-pointer ${
                activeTab === interfaces.IOwnerCreateUpdateTabsType.notes
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
                if (isFetching) {
                  return;
                }

                const newActiveTab =
                  interfaces.IOwnerCreateUpdateTabsType.access;

                setActiveTab(newActiveTab);
                window.history.pushState('', '', `#${newActiveTab}`);
              }}
              className={`max-checkbox mr-4 c-pointer ${
                activeTab === interfaces.IOwnerCreateUpdateTabsType.access
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
                if (isFetching) {
                  return;
                }

                const newActiveTab =
                  interfaces.IOwnerCreateUpdateTabsType.integrations;

                setActiveTab(newActiveTab);
                window.history.pushState('', '', `#${newActiveTab}`);
              }}
              className={`max-checkbox mr-4 c-pointer ${
                activeTab === interfaces.IOwnerCreateUpdateTabsType.integrations
                  ? 'active-check'
                  : ''
              }`}
            >
              <h6 className="check-h-text">Integration</h6>
            </div>
          )}
        </div>

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.generalInfo &&
          tabPerms.generalInfo && (
            <TabGeneralInfo
              emails={record.emails}
              phoneNumbers={record.phoneNumbers}
              addresses={[
                record.primaryAddress,
                record.billingAddress,
                ...record.addresses,
              ]}
            />
          )}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.properties &&
          tabPerms.properties && (
            <TabProperties
              accountProperties={accountProperties}
              setAccountProperties={setAccountProperties}
            />
          )}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.access &&
          tabPerms.access && (
            <TabAccess access={record.access} accountUsers={accountUsers} />
          )}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.notes &&
          tabPerms.notes && <TabNotes userOwnerId={params.userOwnerId} />}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.integrations &&
          tabPerms.integrations && <TabIntegration rm={record.rm} />}
      </div>
    </Main>
  );
}
