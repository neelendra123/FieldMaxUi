import { useState, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';
import { useSelector } from 'react-redux';

import { ICommonAddress, IModuleKind, IOption } from '../../../interfaces';

import { successToast, warningToast } from '../../../utils/toast';
import { validateData } from '../../../utils/joi';

import { IAppReduxState } from '../../../redux/reducer';

import Main from '../../../components/Layouts/Main';
import {
  TextInputComp,
  SelectInputComp,
  TextAreaComp,
  FileInputComp,
} from '../../../components/Forms';
import { IsFetching } from '../../../components/Common';
import { RoundedCameraIcon } from '../../../components/Icons';

import { DefaultIntegrationCommonOptions } from '../../IntegrationCommons/constants';
import { integrationCommonListAllService } from '../../IntegrationCommons/services';

import { AddressAddEdit } from '../../Address';
import { DefaultCommonAddress } from '../../Address/constants';

import { mediaUploadCommonService } from '../../Common/services';

import { IUserListAllRes } from '../../Users/interfaces';
import { userListAllService } from '../../Users/services';

import { PropertiesCircleIcon2x } from '../../Properties/Icons';
import PropertyRoutes from '../../Properties/routes';

import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

import { TabGeneralInfo, TabAccess, TabIntegrations } from '../Commons/AddEdit';
import TabNotes from './TabNotes';

const DefaultFormError = {
  name: '',
  unitTypes: '',
  bedrooms: '',
  bathrooms: '',
  squareFootage: '',
  pic: '',
};

export default function PropertyUnitEdit() {
  const isMounted = useMountedState();
  const params: { propertyId: string; propertyUnitId: string } = useParams();
  const { hash } = useLocation();
  const history: any = useHistory();

  const {
    auth: { accountIndex, accountsPermissions, authUser },
    redirect: { redirectPath },
  } = useSelector((state: IAppReduxState) => state);

  const [perms, setPerms] = useState(
    accountsPermissions[accountIndex].properties
  );
  const [tabPerms, setTabPerms] = useState<
    Record<interfaces.IPropertyUnitCreateUpdateTabsType, boolean>
  >({
    generalInfo: false,
    notes: false,
    access: false,
    integrations: false,
    jobs: false,
    timeLine: false,
  });

  const [isFetching, setIsFetching] = useState(false);

  const [errors, setErrors] = useState(DefaultFormError);

  const [activeTab, setActiveTab] =
    useState<interfaces.IPropertyUnitCreateUpdateTabsType>(
      (hash?.substring(1) as interfaces.IPropertyUnitCreateUpdateTabsType) ||
        interfaces.IPropertyUnitCreateUpdateTabsType.generalInfo
    );

  const [integrationCommons, setIntegrationCommons] = useState(
    DefaultIntegrationCommonOptions
  );

  const [record, setRecord] =
    useState<interfaces.IPropertyUnitDetailsPopulated>();

  const [pic, setPic] = useState(constants.DefaultPropertyUnitCreateEdit.pic);
  const [name, setName] = useState(
    constants.DefaultPropertyUnitCreateEdit.name
  );
  const [unitTypes, setUnitTypes] = useState(
    constants.DefaultPropertyUnitCreateEdit.unitTypes
  );
  const [bedrooms, setBedrooms] = useState(
    constants.DefaultPropertyUnitCreateEdit.bedrooms
  );
  const [bathrooms, setBathrooms] = useState(
    constants.DefaultPropertyUnitCreateEdit.bathrooms
  );
  const [squareFootage, setSquareFootage] = useState(
    constants.DefaultPropertyUnitCreateEdit.squareFootage
  );
  const [comments, setComments] = useState(
    constants.DefaultPropertyUnitCreateEdit.comments
  );
  //  Tab General Field
  const [addressIndex, setAddressIndex] = useState(-1);
  const [addresses, setAddresses] = useState([
    { ...DefaultCommonAddress, name: 'Primary' },
  ]);

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
    if (addressIndex === 0) {
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
  //  Tab Access
  const [accountUsers, setAccountUsers] = useState<IUserListAllRes[]>([]);
  const [access, setAccess] = useState(
    constants.DefaultPropertyUnitCreateEdit.access
  );
  //  Tab Integrations Fields
  const [rm, setRM] = useState(constants.DefaultPropertyUnitCreateEdit.rm);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const [details, usersAll, intCommons] = await Promise.all([
        services.propertyUnitDetailsService(params.propertyUnitId, {}),
        userListAllService({
          moduleKind: IModuleKind.properties,
        }),
        integrationCommonListAllService(),
      ]);

      if (!isMounted()) {
        return;
      }

      setRecord(details);
      setAccountUsers(usersAll);
      setIntegrationCommons(intCommons);

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

  const OnSaveCommonValidate = () => {
    let formData: interfaces.IPropertyUnitEditReqData = {
      name,
      unitTypes: unitTypes.map((unitType) => unitType.value),
      bedrooms,
      bathrooms,
      squareFootage,
      comments,
    };

    if (tabPerms.generalInfo) {
      //  Tab General Field

      formData = {
        ...formData,
        primaryAddress: addresses[0],
        addresses: addresses.filter((address, index) => index > 0),
      };
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

    const validate = validateData(
      formData,
      constants.PropertyUnitEditValsScheme
    );
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
          name: 'Pic',
          moduleKind: 'propertyUnits',
        });
      }

      const result = await services.propertyUnitEditService(
        params.propertyUnitId,
        formData
      );

      successToast(result.message);

      if (redirectPath) {
        return history.push(redirectPath);
      }

      history?.goBack();
    } catch (error: any) {
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

  useEffect(() => {
    setPerms(accountsPermissions[accountIndex].properties);
  }, [authUser, accountIndex, accountsPermissions]);

  useEffect(() => {
    //  This set the tabs permissions
    setTabPerms({
      ...tabPerms,
      generalInfo: perms.generalInfo.all || perms.generalInfo.edit,
      jobs: perms.jobs.all || perms.jobs.edit,
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

    //  Loading first time
    const newPic = {
      default: record.picURL,
      type: '',
      name: '',
      mediaURL: '',
    };

    setPic(newPic);

    setName(record.name);
    setBedrooms(record.bedrooms);
    setBathrooms(record.bathrooms);
    setSquareFootage(record.squareFootage);
    setComments(record.comments);
    setAddresses([record.primaryAddress, ...record.addresses]);
    setAccess(record.access);
    setRM(record.rm);
  }, [record]);

  useEffect(() => {
    fetchData();
  }, []);

  if (addressIndex !== -1) {
    return (
      <AddressAddEdit
        sideBarId={PropertyRoutes.routes.edit.sideBarId}
        defaultAddress={addresses[addressIndex]}
        onSaveEffect={addressAddEditEffect}
        addressCancelEvent={addressCancelEvent}
      />
    );
  }
  return (
    <Main sideBarId={PropertyRoutes.routes.add.sideBarId}>
      {isFetching && <IsFetching />}

      <div className="mx-4">
        <div className="create-property-wrap">
          <div className="main-heading-wrap flex-space-between-wrap mb-4 py-2 pt-4">
            <div className="dashboard-heading-title">
              <h6 className="title">Update Unit</h6>
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
                Update
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-center justify-content-lg-start">
            <div className="position-relative d-inline">
              <div className="owner-avatar">
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
              </div>

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
                className="form-control form-control-sm"
                name="name"
                id="name"
                label="Name *"
                placeholder="Name *"
                onChange={setName}
                value={name}
                errorMsg={errors.name}
                autoFocus
              />
            </div>

            <div className="col-md-6 mb-3">
              <SelectInputComp
                name="unitTypes"
                placeholder="Unit Types *"
                label="Unit Types *"
                value={unitTypes}
                options={integrationCommons.unitTypes.map((type) => {
                  let label = type.name;

                  if (type.description) {
                    label = `${label} (${type.description})`;
                  }

                  return {
                    value: type.id,
                    label: label,
                  };
                })}
                onChange={setUnitTypes}
                isMulti
                errorMsg={errors.unitTypes}
              />
            </div>

            <div className="col-md-6 mb-3">
              <TextInputComp
                type="number"
                className="form-control form-control-sm"
                name="bathrooms"
                id="bathrooms"
                label="Bathrooms"
                placeholder="Bathrooms"
                onChange={setBathrooms}
                value={bathrooms}
                errorMsg={errors.bathrooms}
                min={0}
              />
            </div>

            <div className="col-md-6 mb-3">
              <TextInputComp
                type="number"
                name="bedrooms"
                label="Bedrooms"
                placeholder="Bedrooms"
                onChange={setBedrooms}
                value={bedrooms}
                className="form-control form-control-sm"
                errorMsg={errors.bedrooms}
                min={0}
              />
            </div>

            <div className="col-md-6 mb-3">
              <TextInputComp
                type="number"
                name="squareFootage"
                id="squareFootage"
                label="Total Sq. Foot"
                className="form-control form-control-sm"
                placeholder="Total Sq. Foot"
                value={squareFootage}
                onChange={setSquareFootage}
                errorMsg={errors.squareFootage}
                min={0}
              />
            </div>

            <div className="col-md-6 mb-3">
              <TextAreaComp
                name="comments"
                id="comments"
                onChange={setComments}
                rows={3}
                value={comments}
                placeholder="Comments"
                className="form-control form-control-sm"
                label="Comments"
                labelClassName="d-none d-md-block font-weight-bold"
              />
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
                  if (isFetching) {
                    return;
                  }

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

            {tabPerms.access && (
              <div
                onClick={() => {
                  if (isFetching) {
                    return;
                  }

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
                  if (isFetching) {
                    return;
                  }

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
                <h6 className="check-h-text">Integration</h6>
              </div>
            )}
          </div>

          {activeTab ===
            interfaces.IPropertyUnitCreateUpdateTabsType.generalInfo &&
            tabPerms.generalInfo && (
              <TabGeneralInfo
                // backupDataFunc={backupDataFunc}
                setAddressIndex={setAddressIndex}
                addresses={addresses}
                setAddresses={setAddresses}
                addressAddEvent={addressAddEvent}
                errors={errors}
              />
            )}

          {activeTab === interfaces.IPropertyUnitCreateUpdateTabsType.access &&
            tabPerms.access && (
              <TabAccess
                accountUsers={accountUsers}
                access={access}
                setAccess={setAccess}
              />
            )}

          {activeTab === interfaces.IPropertyUnitCreateUpdateTabsType.notes &&
            tabPerms.notes && (
              <TabNotes
                propertyId={params.propertyId}
                propertyUnitId={params.propertyUnitId}
              />
            )}

          {activeTab ===
            interfaces.IPropertyUnitCreateUpdateTabsType.integrations &&
            tabPerms.integrations && (
              <TabIntegrations rm={rm} setRM={setRM} errors={errors} />
            )}

          {!!redirectPath && (
            <button
              className="btn btn-danger w-100 mt-3 d-block d-lg-none"
              disabled={isFetching}
              onClick={() => {
                history.push(redirectPath);
              }}
            >
              Cancel
            </button>
          )}

          <button
            className="btn btn-primary w-100 mt-3 d-block d-lg-none"
            disabled={isFetching}
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </Main>
  );
}
