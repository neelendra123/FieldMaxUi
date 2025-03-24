import { useState, useEffect } from 'react';
import { useMountedState } from 'react-use';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ICommonAddress, IModuleKind, IOption } from '../../../interfaces';
import { DefaultCommonMediaUpload } from '../../../constants';

import { validateData } from '../../../utils/joi';
import { successToast, warningToast } from '../../../utils/toast';
import { forceCastTS, sleep } from '../../../utils/common';

import { IAppReduxState } from '../../../redux/reducer';
import {
  propertyCreateEditBackupResetAction,
  propertyEditBackupUpdateAction,
} from '../../../redux/properties/properties.actions';
import { redirectResetAction } from '../../../redux/redirects/redirects.actions';

import Main from '../../../components/Layouts/Main';
import {
  TextInputComp,
  SelectInputComp,
  FileInputComp,
  TextAreaComp,
} from '../../../components/Forms';
import { RoundedCameraIcon } from '../../../components/Icons';
import { IsFetching } from '../../../components/Common';

import { mediaUploadCommonService } from '../../Common/services';

import { DefaultIntegrationCommonOptions } from '../../IntegrationCommons/constants';
import { integrationCommonListAllService } from '../../IntegrationCommons/services';

import { DefaultCommonAddress } from '../../Address/constants';
import AddressAddEdit from '../../Address/AddEdit/AddressAddEdit';

import { IUserListAllRes } from '../../Users/interfaces';
import { userListAllService } from '../../Users/services';
import { formatUserName } from '../../Users/utils';

import { IPropertyUnitListAll } from '../../PropertyUnits/interfaces';

import { userOwnersListAllService } from '../../UserOwners/services';

import { PropertiesCircleIcon2x } from '../Icons';
import PropertiesRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

import {
  TabGeneralInfo,
  TabUserOwners,
  TabPropertyUnits,
  TabAccess,
  TabIntegrations,
} from '../Commons/AddEdit';
import TabNotes from './TabNotes';

export interface IPropertiesAddHistoryState {
  disableOwner?: boolean;
  redirect: string;
}

const DefaultFormError = {
  pic: '',
  name: '',
  shortName: '',
  chargeTypes: '',
  propertyTypes: '',
  formatted: '',
  primaryAddress: '',
  billingAddress: '',
};

export default function PropertyEdit() {
  const isMounted = useMountedState();
  const params: { propertyId: string } = useParams();
  const history = useHistory();
  const { hash } = useLocation();

  const {
    auth: { accountIndex, accountsPermissions, authUser },
    property: { editBackup: dataBackup },
    redirect: { redirectCreated },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

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
    access: false,
    integrations: false,
    jobs: false,
    timeLine: false,
  });

  const [isFetching, setIsFetching] = useState(false);

  const [errors, setErrors] = useState(DefaultFormError);

  const [activeTab, setActiveTab] =
    useState<interfaces.IPropertyCreateUpdateTabsType>(
      (hash?.substring(1) as interfaces.IPropertyCreateUpdateTabsType) ||
        dataBackup.activeTab
    );

  const [integrationCommons, setIntegrationCommons] = useState(
    DefaultIntegrationCommonOptions
  );

  const [record, setRecord] = useState<interfaces.IProperty>();

  const [pic, setPic] = useState(DefaultCommonMediaUpload);
  const [name, setName] = useState(dataBackup.name);
  const [shortName, setShortName] = useState(dataBackup.shortName);
  const [taxId, setTaxId] = useState(dataBackup.taxId);
  const [squareFootage, setSquareFootage] = useState(dataBackup.squareFootage);
  const [comments, setComments] = useState(dataBackup.comments);

  const [propertyTypes, setPropertyTypes] = useState(dataBackup.propertyTypes);
  const [chargeTypes, setChargeTypes] = useState(dataBackup.chargeTypes);

  //  Tab General Info
  const [addressIndex, setAddressIndex] = useState(-1);
  const [addresses, setAddresses] = useState(dataBackup.addresses);

  const addressAddEditEffect = (adr: ICommonAddress) => {
    const newAddresses = [...addresses];

    newAddresses[addressIndex] = adr;

    setAddressIndex(-1);
    setAddresses(newAddresses);
  };
  const addressAddEvent = () => {
    const newAddresses = [...addresses, { ...DefaultCommonAddress }];

    setAddressIndex(newAddresses.length - 1);
    setAddresses(newAddresses);
  };
  const addressCancelEvent = () => {
    //If editing Primary or Billing Address
    if (addressIndex === 0 || addressIndex === 1) {
      setAddressIndex(-1);
      return;
    }

    let newAddresses = [...addresses];

    //  Removing empty Address
    if (!addresses[addressIndex].formatted) {
      newAddresses = newAddresses.filter((newAddress, index) => {
        return index !== addressIndex;
      });
    }

    setAddressIndex(-1);
    setAddresses(newAddresses);
  };

  //  Tab UserOwners
  const [accountUserOwners, setAccountUserOwners] = useState<
    interfaces.IPropertyUserOwnersListAll[]
  >([]);
  const [userOwners, setUserOwners] = useState(dataBackup.userOwners);

  //  Tab Units
  const [accountPropertyUnits, setAccountPropertyUnits] = useState<
    IPropertyUnitListAll[]
  >([]);
  const [propertyUnits, setPropertyUnits] = useState(dataBackup.propertyUnits);

  //  Tab Access
  const [accountUsers, setAccountUsers] = useState<IUserListAllRes[]>([]);
  const [access, setAccess] = useState(dataBackup.access);

  //  Tab Integrations
  const [rm, setRM] = useState(dataBackup.rm);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      if (redirectCreated.kind) {
        if (redirectCreated.userOwnerId) {
          //  This is when redirecting after creating a userOwner, then preselcting the created
          userOwners.push(redirectCreated.userOwnerId);

          setActiveTab(interfaces.IPropertyCreateUpdateTabsType.userOwners);
        } else if (redirectCreated.propertyUnitId) {
          //  This is when redirecting after creating a unit, then preselcting the created
          propertyUnits.push(redirectCreated.propertyUnitId);

          setActiveTab(interfaces.IPropertyCreateUpdateTabsType.propertyUnits);
        }
      }

      const [recordDetails, usersAll, intCommons, allAccountUserOwners] =
        await Promise.all([
          services.propertyDetailsService(params.propertyId, {
            populatePropertyUnits: true,
          }),
          userListAllService({
            moduleKind: IModuleKind.properties,
          }),
          integrationCommonListAllService(),
          userOwnersListAllService(),
        ]);

      if (!isMounted()) {
        return;
      }

      setIntegrationCommons(intCommons);
      setAccountUsers(usersAll);

      const newAccountUserOwners = allAccountUserOwners.map(
        (accountUserOwner) => {
          return {
            ...accountUserOwner,
            label: formatUserName(
              accountUserOwner.firstName,
              accountUserOwner.lastName
            ),
            value: accountUserOwner.id,
            isSelected:
              userOwners.indexOf(accountUserOwner.id) !== -1 ? true : false,
          };
        }
      );
      setAccountUserOwners(newAccountUserOwners);

      setAccountPropertyUnits(recordDetails.propertyUnits);

      const record = forceCastTS<interfaces.IProperty>({
        ...recordDetails,
        propertyUnits: recordDetails.propertyUnits.map(
          (propertyUnit) => propertyUnit.id
        ),
      });
      setRecord(record);

      //Reseting the created redirect data
      if (redirectCreated.kind) {
        reduxActionDispatch(redirectResetAction());

        //Backing up the newly created unit or owner
        backupDataFunc(undefined, activeTab);
      }
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  const OnSaveCommonValidate = () => {
    let formData: interfaces.IPropertyEditReqData = {
      name,
      shortName,

      taxId,
      squareFootage,
      comments,

      propertyTypes: propertyTypes.map((propertyType) => propertyType.value),
      chargeTypes: chargeTypes.map((chargeType) => chargeType.value),
    };

    if (tabPerms.generalInfo) {
      //  Tab General Field

      formData = {
        ...formData,
        primaryAddress: addresses[0],
        billingAddress: addresses[1],
        addresses: addresses.filter((address, index) => index > 1),
      };
    }

    if (tabPerms.userOwners) {
      //  Tab Owners
      formData.userOwners = userOwners;
    }

    if (tabPerms.propertyUnits) {
      //  Tab Units
      formData.propertyUnits = propertyUnits;
    }

    if (tabPerms.access) {
      //  Tab Access

      //  User Access
      const userAccess = { ...access };
      if (access.all) {
        userAccess.users = [];
      }

      formData.access = userAccess;
    }

    if (tabPerms.integrations) {
      //  Tab Rm Fields
      formData.rm = rm;
    }

    const validate = validateData(formData, constants.PropertyEditValsScheme);
    if (validate.errors) {
      const errors = Object.values(validate.errors);
      warningToast(errors[0] as string);

      setErrors(validate.errors);
      return;
    }

    setIsFetching(true);
    setErrors(DefaultFormError);

    return formData;
  };

  const onSave = async () => {
    const formData = OnSaveCommonValidate();
    if (!formData) {
      return;
    }

    try {
      if (pic.mediaURL) {
        formData.pic = await mediaUploadCommonService(pic, {
          name: 'Media',
          moduleKind: IModuleKind.properties,
        });
      }

      const result = await services.propertyEditService(
        params.propertyId,
        formData
      );

      successToast(result.message);

      reduxActionDispatch(propertyCreateEditBackupResetAction());

      if (!isMounted()) {
        return;
      }

      history.push(PropertiesRoutes.routes.list.path);
    } catch (error: any) {
      console.error(error);

      if (!isMounted()) {
        return;
      }

      if (error.response?.data?.data) {
        setErrors({
          ...DefaultFormError,
          ...error.response.data.data,
        });
      }
    }

    if (!isMounted()) {
      return;
    }
    setIsFetching(false);
  };

  const backupDataFunc = (
    newBackup?: interfaces.IPropertyCreateEditBackup,
    newTab: interfaces.IPropertyCreateUpdateTabsType = activeTab
  ) => {
    if (!record?.id) {
      return;
    }

    const newBackupData: interfaces.IPropertyCreateEditBackup = newBackup || {
      id: params.propertyId,
      activeTab: newTab,

      pic,
      name,
      shortName,
      squareFootage,
      taxId,
      comments,
      propertyTypes,
      chargeTypes,
      //  Tab General Field
      addresses,
      //  Tab UserOwners
      userOwners,
      //  Tab Units
      propertyUnits,
      //  Tab notes
      notes: [],
      //  Tab Access
      access,
      //  Tab RM Fields
      rm,
    };

    reduxActionDispatch(
      propertyEditBackupUpdateAction({
        ...record,
        ...newBackupData,
        activeTab,
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPerms(accountsPermissions[accountIndex].properties);
  }, [authUser, accountIndex, accountsPermissions]);

  useEffect(() => {
    //  This set the tabs permissions
    setTabPerms({
      ...tabPerms,
      generalInfo: perms.generalInfo.all || perms.generalInfo.edit,
      userOwners: perms.userOwners.all || perms.userOwners.edit,
      propertyUnits: perms.propertyUnits.all || perms.propertyUnits.edit,
      access: perms.access.all || perms.access.edit,
      notes: perms.notes.all || perms.notes.edit,
      integrations: perms.integrations.all || perms.integrations.edit,
    });
  }, [perms]);

  useEffect(() => {
    //  This updates the UI Details based on api call or from redux backup
    if (!record?.id) {
      return;
    }

    const firstTime =
      !dataBackup.id ||
      dataBackup.id !== params.propertyId ||
      !dataBackup.shortName;

    if (firstTime) {
      //  Loading first time
      const newPic = {
        default: record.picURL,
        type: '',
        name: '',
        mediaURL: '',
      };

      setPic(newPic);
      setName(record.name);
      setShortName(record.shortName);
      setTaxId(record.taxId);
      setSquareFootage(record.squareFootage);
      setComments(record.comments);

      //  Property Types
      const newPropertyTypes: IOption[] = [];
      integrationCommons.propertyTypes.forEach((type) => {
        if (record.propertyTypes.indexOf(type.id) !== -1) {
          newPropertyTypes.push({
            label: type.name,
            value: type.id,
          });
        }
      });
      setPropertyTypes(newPropertyTypes);

      //  Charge Types
      const newChargeTypes: IOption[] = [];
      integrationCommons.chargeTypes.forEach((type) => {
        if (record.chargeTypes.indexOf(type.id) !== -1) {
          newChargeTypes.push({
            label: type.name,
            value: type.id,
          });
        }
      });
      setChargeTypes(newChargeTypes);

      setAddresses([
        record.primaryAddress,
        record.billingAddress,
        ...record.addresses,
      ]);

      setUserOwners(record.userOwners);

      setPropertyUnits(record.propertyUnits);

      setAccess(record.access);

      setRM(record.rm);
    } else {
      //  Loading second time after creating some property or unit
      setPic(dataBackup.pic);
      setName(dataBackup.name);
      setShortName(dataBackup.shortName);
      setTaxId(dataBackup.taxId);
      setSquareFootage(dataBackup.squareFootage);
      setComments(dataBackup.comments);

      setPropertyTypes(dataBackup.propertyTypes);
      setChargeTypes(dataBackup.chargeTypes);

      setAddresses(dataBackup.addresses);

      setUserOwners(dataBackup.userOwners);

      setPropertyUnits(dataBackup.propertyUnits);

      setAccess(dataBackup.access);

      setRM(dataBackup.rm);
    }

    (async () => {
      await sleep(500);
      backupDataFunc();
    })();
  }, [record]);

  useEffect(() => {});

  if (addressIndex !== -1) {
    return (
      <AddressAddEdit
        sideBarId={PropertiesRoutes.routes.add.sideBarId}
        defaultAddress={addresses[addressIndex]}
        onSaveEffect={addressAddEditEffect}
        addressCancelEvent={addressCancelEvent}
      />
    );
  }

  return (
    <Main sideBarId={PropertiesRoutes.routes.add.sideBarId}>
      {isFetching && <IsFetching />}

      <div className="mx-4">
        <div className="create-property-wrap">
          <div className="main-heading-wrap flex-space-between-wrap mb-4 py-2 pt-4">
            <div className="dashboard-heading-title">
              <h6 className="title">Update Property</h6>
            </div>

            <div className="mobile-d-none">
              <button
                className="btn btn-primary"
                disabled={isFetching}
                onClick={onSave}
              >
                Update
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-center justify-content-lg-start">
            <div className="position-relative d-inline">
              {pic.mediaURL || pic.default ? (
                <img
                  className="account-user-img"
                  src={pic.mediaURL || pic.default}
                  alt={name}
                  title={name}
                />
              ) : (
                <PropertiesCircleIcon2x />
              )}

              <div className="cameraRounded">
                <label htmlFor="pic">
                  <RoundedCameraIcon />
                </label>

                <FileInputComp
                  className="d-none"
                  id="pic"
                  name="pic"
                  accept="image/*"
                  type="file"
                  onChange={(file) => {
                    if (!file) {
                      setPic({
                        default: record?.pic,
                        type: '',
                        name: '',
                        mediaURL: '',
                      });
                      return;
                    }

                    setPic({
                      ...pic,
                      mediaURL: window.URL.createObjectURL(file),
                      type: file.type,
                      name: file.name,
                    });
                  }}
                  placeholder="Profile Pic"
                />
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <TextInputComp
                name="name"
                label="Full Name"
                placeholder="Full Name *"
                autoFocus
                onChange={setName}
                value={name}
                errorMsg={errors.name}
              />
            </div>
            <div className="col-md-6 mb-3">
              <TextInputComp
                name="shortName"
                label="Short Name"
                placeholder="Short Name *"
                onChange={setShortName}
                value={shortName}
                errorMsg={errors.shortName}
              />
            </div>

            <div className="col-md-6 mb-3">
              <SelectInputComp
                label="Property Types *"
                labelClassName="mb-2"
                name="propertyTypes"
                placeholder="Property Types *"
                value={propertyTypes}
                options={integrationCommons.propertyTypes.map(
                  (propertyType) => {
                    let label = propertyType.name;

                    if (propertyType.description) {
                      label = `${label} (${propertyType.description})`;
                    }

                    return {
                      value: propertyType.id,
                      label: label,
                    };
                  }
                )}
                onChange={setPropertyTypes}
                isMulti
                errorMsg={errors.propertyTypes}
              />
            </div>

            <div className="col-md-6 mb-3">
              <SelectInputComp
                label="Charge Types *"
                labelClassName="mb-2"
                name="chargeTypes"
                placeholder="Charge Types *"
                value={chargeTypes}
                options={integrationCommons.chargeTypes.map((chargeType) => {
                  let label = chargeType.name;

                  if (chargeType.description) {
                    label = `${label} (${chargeType.description})`;
                  }

                  return {
                    value: chargeType.id,
                    label: label,
                  };
                })}
                onChange={setChargeTypes}
                isMulti
                errorMsg={errors.chargeTypes}
              />
            </div>

            <div className="col-md-6 mb-3">
              <TextInputComp
                type="number"
                name="squareFootage"
                id="squareFootage"
                label="Total Sq. Foot"
                placeholder="Total Sq. Foot"
                onChange={setSquareFootage}
                value={squareFootage}
                min={0}
              />
            </div>

            <div className="col-md-6 mb-3">
              <TextInputComp
                name="taxId"
                id="taxId"
                label="Tax Id"
                placeholder="Tax Id"
                onChange={setTaxId}
                value={taxId}
              />
            </div>

            <div className="col-md-12">
              <TextAreaComp
                name="comments"
                id="comments"
                onChange={setComments}
                rows={3}
                value={comments}
                placeholder="Comments"
                label="Comments"
                labelClassName="d-none d-md-block font-weight-bold"
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

          {tabPerms.notes && (
            <div
              onClick={() => {
                if (isFetching) {
                  return;
                }

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
                if (isFetching) {
                  return;
                }

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
                if (isFetching) {
                  return;
                }

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
              <h6 className="check-h-text">Integration</h6>
            </div>
          )}
        </div>

        {activeTab === interfaces.IPropertyCreateUpdateTabsType.generalInfo &&
          tabPerms.generalInfo && (
            <TabGeneralInfo
              backupDataFunc={backupDataFunc}
              setAddressIndex={setAddressIndex}
              addresses={addresses}
              setAddresses={setAddresses}
              addressAddEvent={addressAddEvent}
              errors={errors}
            />
          )}

        {activeTab === interfaces.IPropertyCreateUpdateTabsType.userOwners && (
          <TabUserOwners
            accountUserOwners={accountUserOwners}
            setAccountUserOwners={setAccountUserOwners}
            userOwners={userOwners}
            setUserOwners={setUserOwners}
            backupDataFunc={backupDataFunc}
            isFetching={isFetching}
            redirectPath={null}
          />
        )}

        {activeTab === interfaces.IPropertyCreateUpdateTabsType.propertyUnits &&
          tabPerms.propertyUnits && (
            <TabPropertyUnits
              propertyId={params.propertyId}
              accountPropertyUnits={accountPropertyUnits}
              propertyUnits={propertyUnits}
              setPropertyUnits={setPropertyUnits}
              isFetching={isFetching}
              backupDataFunc={backupDataFunc}
              redirectPath={null}
            />
          )}

        {activeTab === interfaces.IPropertyCreateUpdateTabsType.access &&
          tabPerms.access && (
            <TabAccess
              accountUsers={accountUsers}
              access={access}
              setAccess={setAccess}
              backupDataFunc={backupDataFunc}
            />
          )}

        {activeTab === interfaces.IPropertyCreateUpdateTabsType.notes &&
          tabPerms.notes && <TabNotes propertyId={params.propertyId} />}

        {activeTab === interfaces.IPropertyCreateUpdateTabsType.integrations &&
          tabPerms.integrations && (
            <TabIntegrations rm={rm} setRM={setRM} errors={errors} />
          )}

        <button
          className="btn btn-primary w-100 mt-3 d-block d-lg-none"
          disabled={isFetching}
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </Main>
  );
}
