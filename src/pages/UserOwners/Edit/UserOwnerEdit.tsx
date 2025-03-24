import { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useMountedState } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';

import { ICommonAddress, IModuleKind } from '../../../interfaces';
import { DefaultCommonMediaUpload } from '../../../constants';

import { sleep } from '../../../utils/common';

import { IAppReduxState } from '../../../redux/reducer';
import {
  userOwnerEditBackupUpdateAction,
  userOwnerCreateEditBackupResetAction,
} from '../../../redux/userOwners/userOwners.actions';
import { redirectResetAction } from '../../../redux/redirects/redirects.actions';

import { validateData } from '../../../utils/joi';
import { successToast, warningToast } from '../../../utils/toast';

import { OwnerIcon, RoundedCameraIcon } from '../../../components/Icons';
import {
  TextInputComp,
  TextAreaComp,
  FileInputComp,
} from '../../../components/Forms';
import { IsFetching } from '../../../components/Common';
import Main from '../../../components/Layouts/Main';

import { DefaultCommonAddress } from '../../Address/constants';
import AddressAddEdit from '../../Address/AddEdit/AddressAddEdit';

import { mediaUploadCommonService } from '../../Common/services';
import { ICommonEmail, ICommonPhoneNumber } from '../../Common/interfaces';

import { IUserListAllRes } from '../../Users/interfaces';
import { userListAllService } from '../../Users/services';

import { propertiesListAllService } from '../../Properties/services';

import UserOwnerRoutes from '../routes';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

import TabGeneralInfo from './TabGeneralInfo';
import TabProperties from './TabProperties';
import TabAccess from './TabAccess';
import TabNotes from './TabNotes';
import TabIntegrations from './TabIntegrations';

const DefaultFormError = {
  firstName: '',
  lastName: '',
  email: '',
};

export default function UserOwnerAdd() {
  const isMounted = useMountedState();
  const params: { userOwnerId: string } = useParams();
  const history = useHistory();
  const { hash } = useLocation();

  const {
    userOwner: { editBackup },
    redirect: { redirectCreated },
    auth: { accountIndex, accountsPermissions, authUser },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

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

  const [errors, setErrors] = useState(DefaultFormError);

  const [activeTab, setActiveTab] =
    useState<interfaces.IOwnerCreateUpdateTabsType>(
      (hash?.substring(1) as interfaces.IOwnerCreateUpdateTabsType) ||
        interfaces.IOwnerCreateUpdateTabsType.generalInfo
    );

  const [record, setRecord] = useState<interfaces.IUserOwner>();
  const [accountProperties, setAccountProperties] = useState<
    interfaces.IUserOwnerPropertiesListAll[]
  >([]);
  const [accountUsers, setAccountUsers] = useState<IUserListAllRes[]>([]);

  const [pic, setPic] = useState({ ...DefaultCommonMediaUpload });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [taxId, setTaxId] = useState('');
  const [comments, setComments] = useState('');

  //  Tab General Field
  const [emails, setEmails] = useState<ICommonEmail[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<ICommonPhoneNumber[]>([]);

  const [addressIndex, setAddressIndex] = useState(-1);
  const [addresses, setAddresses] = useState<ICommonAddress[]>([]);

  //  Tab Properties
  let [properties, setProperties] = useState(
    constants.DefaultUserOwnerCreateEdit.properties
  );

  //  Tab Access
  const [access, setAccess] = useState(
    constants.DefaultUserOwnerCreateEdit.access
  );

  //  Tab Integrations Fields
  const [rm, setRM] = useState(constants.DefaultUserOwnerCreateEdit.rm);

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

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const [userOwnerDetails, propertiesAll, usersAll] = await Promise.all([
        services.userOwnerDetailsService(params.userOwnerId),
        propertiesListAllService(),
        userListAllService({
          moduleKind: IModuleKind.userOwners,
        }),
      ]);

      if (!isMounted()) {
        return;
      }

      let newProperties = [...properties];
      if (editBackup.id === params.userOwnerId) {
        newProperties = [...editBackup.properties];
      }

      if (redirectCreated.kind) {
        //  If redirected back after creating
        if (
          redirectCreated.kind === IModuleKind.properties &&
          redirectCreated.propertyId
        ) {
          //  This is when redirecting after creating a property with its default unit
          newProperties.push({
            propertyId: redirectCreated.propertyId,
            propertyUnits: redirectCreated.propertyUnitId
              ? [redirectCreated.propertyUnitId]
              : [],
          });
        } else if (
          redirectCreated.kind === 'propertyUnits' &&
          redirectCreated.propertyUnitId
        ) {
          //  This is when redirecting after creating a unit
          newProperties.forEach((property) => {
            if (property.propertyId === redirectCreated.propertyId) {
              property.propertyUnits.push(
                redirectCreated.propertyUnitId as string
              );
            }

            return property;
          });
        }
      }

      // if (redirectCreated.kind && redirectCreated.propertyId) {
      //   const newCreated: interfaces.IUserOwnerProperty = {
      //     propertyId: redirectCreated.propertyId,
      //     propertyUnits: redirectCreated.propertyUnitId
      //       ? [redirectCreated.propertyUnitId]
      //       : [],
      //   };

      //   //  This is when redirecting after creating a property or a unit, then preselcting the created
      //   userOwnerDetails.properties.push(newCreated);
      //   //Temp Fix, Redux Data is Immutable
      //   editBackup.properties.push(newCreated);
      // }

      ////////////////////
      //  This is to make Properties & Units Listing Pre Selected

      const userOwnerProperitesCache: Record<string, string[]> = {};
      properties.forEach((property) => {
        userOwnerProperitesCache[property.propertyId] = property.propertyUnits;
      });

      const newAccountProperties = propertiesAll.records.map((property) => {
        let isSelected =
          userOwnerProperitesCache[property.id] !== undefined ? true : false;
        let selectedUnits = isSelected
          ? userOwnerProperitesCache[property.id]
          : [];

        if (redirectCreated.propertyId === property.id) {
          isSelected = true;

          if (redirectCreated.propertyUnitId) {
            selectedUnits.push(redirectCreated.propertyUnitId);
          }
        }

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

      setAccountUsers(usersAll);
      setRecord(userOwnerDetails);

      //Reseting the created redirect data
      if (redirectCreated.kind) {
        reduxActionDispatch(redirectResetAction());

        if (redirectCreated.propertyId) {
          setActiveTab(interfaces.IOwnerCreateUpdateTabsType.properties);
        }
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
    let formData: interfaces.IUserOwnerEditReqData = {
      firstName,
      lastName,
      taxId,
      comments,
    };

    if (tabPerms.generalInfo) {
      //  Tab General Field

      //  Primary, Billing and Other Address
      const primaryAddress = addresses[0];
      const billingAddress = addresses[1];

      const otherAddresses = addresses.filter((address, index) => index > 1);

      formData = {
        ...formData,
        emails,
        phoneNumbers,
        primaryAddress,
        billingAddress,
        addresses: otherAddresses,
      };
    }

    if (tabPerms.properties) {
      //  Tab Properties
      formData.properties = properties;
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

    const validate = validateData(formData, constants.UserOwnerEditValsScheme);
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
          name: 'Profile Pic',
          moduleKind: IModuleKind.userOwners,
        });
      }

      const result = await services.userOwnerEditService(
        params.userOwnerId,
        formData
      );

      successToast(result.message);

      reduxActionDispatch(userOwnerCreateEditBackupResetAction());

      if (!isMounted()) {
        return;
      }

      history.push(UserOwnerRoutes.routes.list.path);
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

  const backupDataFunc = (
    newBackup?: interfaces.IUserOwnerCreateEditBackup
  ) => {
    if (!record?.id) {
      return;
    }

    const userOwnerEditBackup: interfaces.IUserOwnerCreateEditBackup =
      newBackup || {
        id: params.userOwnerId,
        activeTab,

        pic,
        firstName,
        lastName,
        email,
        taxId,
        comments,
        //  Tab General Field
        emails,
        phoneNumbers,
        addresses,
        //  Tab Properties
        properties,
        //  Tab notes
        notes: [],
        //  Tab Access
        access,
        //  Tab Integrations Fields
        rm,
      };

    reduxActionDispatch(
      userOwnerEditBackupUpdateAction({
        ...record,
        ...userOwnerEditBackup,
        activeTab,
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPerms(accountsPermissions[accountIndex].userOwners);
  }, [authUser, accountIndex, accountsPermissions]);

  useEffect(() => {
    //  This set the tabs permissions
    setTabPerms({
      ...tabPerms,
      generalInfo: perms.generalInfo.all || perms.generalInfo.edit,
      properties: perms.properties.all || perms.properties.edit,
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
      !editBackup.id ||
      editBackup.id !== params.userOwnerId ||
      !editBackup.email;

    if (firstTime) {
      //  Loading first time
      const newPic = {
        default: record.picURL,
        type: '',
        name: '',
        mediaURL: '',
      };

      setPic(newPic);

      setFirstName(record.firstName);
      setLastName(record.lastName);
      setEmail(record.email);
      setTaxId(record.taxId);
      setComments(record.comments);

      setPhoneNumbers(record.phoneNumbers);
      setEmails(record.emails);
      setAddresses([
        record.primaryAddress,
        record.billingAddress,
        ...record.addresses,
      ]);

      setProperties(record.properties);

      setRM(record.rm);
    } else {
      //  Loading second time after creating some property or unit
      setPic(editBackup.pic);

      setFirstName(editBackup.firstName);
      setLastName(editBackup.lastName);
      setEmail(editBackup.email);
      setTaxId(editBackup.taxId);
      setComments(editBackup.comments);

      setPhoneNumbers(editBackup.phoneNumbers);
      setEmails(editBackup.emails);
      setAddresses(editBackup.addresses);

      setProperties(editBackup.properties);

      setRM(editBackup.rm);
    }

    (async () => {
      await sleep(500);
      backupDataFunc();
    })();
  }, [record]);

  if (addressIndex !== -1) {
    return (
      <AddressAddEdit
        sideBarId={UserOwnerRoutes.routes.add.sideBarId}
        defaultAddress={addresses[addressIndex]}
        onSaveEffect={addressAddEditEffect}
        addressCancelEvent={addressCancelEvent}
      />
    );
  }

  return (
    <Main sideBarId={UserOwnerRoutes.routes.add.sideBarId}>
      {isFetching && <IsFetching />}

      <div className="px-4">
        <div className="main-heading-wrap d-flex  align-items-center justify-content-between mb-4">
          <div className="dashboard-heading-title d-flex ipad-w-100">
            <h5 className="title">Update Owner</h5>
          </div>
          <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0">
            <div>
              <button
                className="btn btn-primary"
                disabled={isFetching}
                onClick={onSave}
              >
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center justify-content-lg-start">
          <div className="position-relative d-inline">
            <div className="owner-avatar">
              {pic.mediaURL || pic.default ? (
                <img
                  className="account-user-img"
                  src={pic.mediaURL || pic.default}
                  alt={firstName}
                  title={firstName}
                />
              ) : (
                <OwnerIcon />
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
          <div className="col-6">
            <div className="form-group">
              <TextInputComp
                name="firstName"
                id="firstname"
                onChange={setFirstName}
                autoFocus
                placeholder="First Name"
                value={firstName}
                errorMsg={errors.firstName}
                className="form-control form-control-sm"
                label="First Name *"
                labelClassName="d-none d-md-block"
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <TextInputComp
                name="lastName"
                id="lastName"
                onChange={setLastName}
                placeholder="Last Name"
                value={lastName}
                errorMsg={errors.lastName}
                className="form-control form-control-sm"
                label="Last Name"
                labelClassName="d-none d-md-block"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <TextInputComp
                name="email"
                id="email"
                onChange={setEmail}
                placeholder="Email"
                value={email}
                errorMsg={errors.email}
                className="form-control form-control-sm"
                label="Email *"
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
                onChange={setTaxId}
                placeholder="Tax ID"
                value={taxId}
                className="form-control form-control-sm"
                label="Tax ID"
                labelClassName="d-none d-md-block"
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <TextAreaComp
                name="comments"
                id="comments"
                onChange={setComments}
                value={comments}
                placeholder="Comments"
                className="form-control form-control-sm"
                label="Comments"
                labelClassName="d-none d-md-block"
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
              backupDataFunc={backupDataFunc}
              setAddressIndex={setAddressIndex}
              emails={emails}
              setEmails={setEmails}
              phoneNumbers={phoneNumbers}
              setPhoneNumbers={setPhoneNumbers}
              addresses={addresses}
              setAddresses={setAddresses}
              addressAddEvent={addressAddEvent}
              errors={errors}
            />
          )}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.properties &&
          tabPerms.properties && (
            <TabProperties
              accountProperties={accountProperties}
              setAccountProperties={setAccountProperties}
              properties={properties}
              setProperties={setProperties}
              backupDataFunc={backupDataFunc}
              isFetching={isFetching}
            />
          )}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.access &&
          tabPerms.access && (
            <TabAccess
              accountUsers={accountUsers}
              access={access}
              setAccess={setAccess}
              backupDataFunc={backupDataFunc}
            />
          )}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.notes &&
          tabPerms.notes && <TabNotes userOwnerId={params.userOwnerId} />}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.integrations &&
          tabPerms.integrations && (
            <TabIntegrations
              rm={rm}
              setRM={setRM}
              backupDataFunc={backupDataFunc}
              errors={errors}
            />
          )}
      </div>
    </Main>
  );
}
