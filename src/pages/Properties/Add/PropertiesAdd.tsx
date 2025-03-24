import { useState, useEffect } from 'react';
import { useMountedState } from 'react-use';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ICommonAddress, IModuleKind } from '../../../interfaces';

import { IAppReduxState } from '../../../redux/reducer';
import {
  propertyCreateEditBackupResetAction,
  propertyCreateBackupUpdateAction,
} from '../../../redux/properties/properties.actions';
import {
  redirectResetAction,
  redirectPropertyCreateAction,
} from '../../../redux/redirects/redirects.actions';

import { validateData } from '../../../utils/joi';
import { successToast, warningToast } from '../../../utils/toast';
import { generateMongoId, sleep } from '../../../utils/common';

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

import { userOwnersListAllService } from '../../UserOwners/services';

import { IPropertyUnitListAll } from '../../PropertyUnits/interfaces';
import { propertyUnitsListAllService } from '../../PropertyUnits/services';

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

export default function PropertiesAdd() {
  const isMounted = useMountedState();
  const history: any = useHistory();
  const { hash }: { hash: string; state?: { propertyId?: string } } =
    useLocation();

  const {
    property: { createBackup: dataBackup },
    redirect: { redirectCreated, redirectPath },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

  const [isFetching, setIsFetching] = useState(false); // For Skeleton

  const [activeTab, setActiveTab] =
    useState<interfaces.IPropertyCreateUpdateTabsType>(
      (hash?.substring(1) as interfaces.IPropertyCreateUpdateTabsType) ||
        dataBackup.activeTab
    );
  const [errors, setErrors] = useState({ ...DefaultFormError });

  const [defaultId] = useState(dataBackup.id || generateMongoId());

  const [pic, setPic] = useState(dataBackup.pic);
  const [name, setName] = useState(dataBackup.name);
  const [shortName, setShortName] = useState(dataBackup.shortName);
  const [squareFootage, setSquareFootage] = useState(dataBackup.squareFootage);
  const [taxId, setTaxId] = useState(dataBackup.taxId);
  const [comments, setComments] = useState(dataBackup.comments);

  const [integrationCommons, setIntegrationCommons] = useState(
    DefaultIntegrationCommonOptions
  );

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

  //  Tab Notes & History
  const [notes, setNotes] = useState(dataBackup.notes);

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

      const [
        allAccountUsers,
        allAccountUserOwners,
        intCommons,
        allAccountPropertyUnits,
      ] = await Promise.all([
        userListAllService({
          moduleKind: IModuleKind.properties,
        }),
        userOwnersListAllService(),
        integrationCommonListAllService(),
        propertyUnitsListAllService({
          propertyId: defaultId,
        }),
      ]);

      if (!isMounted()) {
        return;
      }

      setAccountUsers(allAccountUsers);
      setIntegrationCommons(intCommons);
      setAccountPropertyUnits(allAccountPropertyUnits);

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

  const onSave = async () => {
    //  User Access
    const userAccess = { ...access };
    if (access.all) {
      userAccess.users = [];
    }

    const formData: interfaces.IPropertyAddReqData = {
      name,
      shortName,

      taxId,
      squareFootage,
      comments,
      propertyTypes: propertyTypes.map((propertyType) => propertyType.value),
      chargeTypes: chargeTypes.map((chargeType) => chargeType.value),
      //  Tab General Info
      primaryAddress: addresses[0],
      billingAddress: addresses[1],
      addresses: addresses.filter((address, index) => index > 1),
      //  Tab Units
      propertyUnits,
      //  Tab Owners
      userOwners,
      //  Tab Notes & History
      notes: notes.map((note) => note.id),
      //  Tab Access
      access: userAccess,
      //  Tab Integrations
      rm,
    };

    const validate = validateData(formData, constants.PropertyAddValsScheme);
    if (validate.errors) {
      const errors = Object.values(validate.errors);
      warningToast(errors[0] as string);

      setErrors(validate.errors);
      return;
    }
    setErrors({ ...DefaultFormError });
    setIsFetching(true);

    try {
      if (pic.mediaURL) {
        formData.pic = await mediaUploadCommonService(pic, {
          name: 'Media',
          moduleKind: IModuleKind.properties,
        });
      }

      const result = await services.propertyAddService(formData);

      successToast(result.message);

      reduxActionDispatch(propertyCreateEditBackupResetAction());

      if (!isMounted()) {
        return;
      }

      if (redirectPath) {
        //  Redirect to previous page with Data
        reduxActionDispatch(
          redirectPropertyCreateAction({
            propertyId: result.data.record.id,
            propertyUnitId: result.data.record.id, //  Default Unit has same ID
            address: formData.primaryAddress,
          })
        );

        return history.push(redirectPath);
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

  const backupDataFunc = async (
    newBackup?: interfaces.IPropertyCreateEditBackup,
    newTab: interfaces.IPropertyCreateUpdateTabsType = activeTab
  ) => {
    await sleep(100);

    const backup: interfaces.IPropertyCreateEditBackup = newBackup || {
      activeTab: newTab,

      id: defaultId,

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
      notes,
      //  Tab Access
      access,
      //  Tab RM Fields
      rm,
    };

    reduxActionDispatch(
      propertyCreateBackupUpdateAction({
        ...dataBackup,
        ...backup,
        activeTab,
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const getType = () => {
    switch (activeTab) {
      case interfaces.IPropertyCreateUpdateTabsType.userOwners:
        return (
          <TabUserOwners
            accountUserOwners={accountUserOwners}
            setAccountUserOwners={setAccountUserOwners}
            userOwners={userOwners}
            setUserOwners={setUserOwners}
            backupDataFunc={backupDataFunc}
            isFetching={isFetching}
            redirectPath={redirectPath}
          />
        );

      case interfaces.IPropertyCreateUpdateTabsType.propertyUnits:
        return (
          <TabPropertyUnits
            propertyId={defaultId}
            accountPropertyUnits={accountPropertyUnits}
            propertyUnits={propertyUnits}
            setPropertyUnits={setPropertyUnits}
            isFetching={isFetching}
            backupDataFunc={backupDataFunc}
            redirectPath={redirectPath}
          />
        );

      case interfaces.IPropertyCreateUpdateTabsType.notes:
        return (
          <TabNotes
            notes={notes}
            setNotes={setNotes}
            backupDataFunc={backupDataFunc}
            propertyId={defaultId}
          />
        );

      case interfaces.IPropertyCreateUpdateTabsType.access:
        return (
          <TabAccess
            accountUsers={accountUsers}
            access={access}
            setAccess={setAccess}
            backupDataFunc={backupDataFunc}
          />
        );

      case interfaces.IPropertyCreateUpdateTabsType.integrations:
        return <TabIntegrations rm={rm} setRM={setRM} errors={errors} />;

      default:
        return (
          <TabGeneralInfo
            backupDataFunc={backupDataFunc}
            setAddressIndex={setAddressIndex}
            addresses={addresses}
            setAddresses={setAddresses}
            addressAddEvent={addressAddEvent}
            errors={errors}
          />
        );
    }
  };

  return (
    <Main sideBarId={PropertiesRoutes.routes.add.sideBarId}>
      {isFetching && <IsFetching />}

      <div className="mx-4">
        <div className="create-property-wrap">
          <div className="main-heading-wrap flex-space-between-wrap mb-4 py-2 pt-4">
            <div className="dashboard-heading-title">
              <h6 className="title">Create Property</h6>
            </div>

            <div className="mobile-d-none">
              {!!redirectPath && (
                <button
                  className="btn btn-danger mr-2"
                  disabled={isFetching}
                  onClick={() => {
                    history.push(redirectPath);
                  }}
                >
                  Cancel
                </button>
              )}

              <button
                className="btn btn-primary"
                disabled={isFetching}
                onClick={onSave}
              >
                Create
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-center justify-content-lg-start">
            <div className="position-relative d-inline">
              {pic.mediaURL ? (
                <img
                  src={pic.mediaURL}
                  alt="pic"
                  className="rounded-circle"
                  style={{
                    width: '126px',
                    height: '126px',
                  }}
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
                      setPic({ mediaURL: '', type: '', name: '' });
                      return;
                    }

                    setPic({
                      mediaURL: window.URL.createObjectURL(file),
                      type: file.type,
                      name: file.name,
                    });
                  }}
                  placeholder="Pic"
                  errorMsg={errors.pic}
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
              activeTab === interfaces.IPropertyCreateUpdateTabsType.generalInfo
                ? 'active-check'
                : ''
            }`}
          >
            <h6 className="check-h-text">General Info</h6>
          </div>

          <div
            onClick={() => {
              if (isFetching) {
                return;
              }

              const newActiveTab =
                interfaces.IPropertyCreateUpdateTabsType.userOwners;

              setActiveTab(newActiveTab);
              window.history.pushState('', '', `#${newActiveTab}`);
            }}
            className={`max-checkbox mr-4 c-pointer ${
              activeTab === interfaces.IPropertyCreateUpdateTabsType.userOwners
                ? 'active-check'
                : ''
            }`}
          >
            <h6 className="check-h-text">Owners</h6>
          </div>

          <div
            onClick={() => {
              if (isFetching) {
                return;
              }

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
            <h6 className="check-h-text">Integrations</h6>
          </div>
        </div>

        {getType()}
      </div>
    </Main>
  );
}
