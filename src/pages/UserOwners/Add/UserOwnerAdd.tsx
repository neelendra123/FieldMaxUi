import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useMountedState } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';

import { ICommonAddress, IModuleKind } from '../../../interfaces';

import { IAppReduxState } from '../../../redux/reducer';
import {
  userOwnerCreateEditBackupResetAction,
  userOwnerCreateBackupUpdateAction,
} from '../../../redux/userOwners/userOwners.actions';
import {
  redirectResetAction,
  redirectUserOwnerCreateAction,
} from '../../../redux/redirects/redirects.actions';

import { validateData } from '../../../utils/joi';
import { successToast, warningToast } from '../../../utils/toast';
import { generateMongoId, sleep } from '../../../utils/common';

import Main from '../../../components/Layouts/Main';
import {
  OwnerIcon,
  RoundedCameraIcon,
  BigMail,
} from '../../../components/Icons';
import {
  TextInputComp,
  TextAreaComp,
  FileInputComp,
} from '../../../components/Forms';
import { IsFetching, Popup } from '../../../components/Common';

import { DefaultCommonAddress } from '../../Address/constants';
import AddressAddEdit from '../../Address/AddEdit/AddressAddEdit';

import { mediaUploadCommonService } from '../../Common/services';

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
  const history = useHistory();
  const { hash } = useLocation();

  const {
    userOwner: { createBackup: dataBackup },
    redirect: { redirectCreated, redirectPath },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

  const [isFetching, setIsFetching] = useState(false);

  const [errors, setErrors] = useState(DefaultFormError);

  const [activeTab, setActiveTab] =
    useState<interfaces.IOwnerCreateUpdateTabsType>(
      (hash?.substring(1) as interfaces.IOwnerCreateUpdateTabsType) ||
        dataBackup.activeTab
    );

  const [defaultId] = useState(generateMongoId());

  const [pic, setPic] = useState(dataBackup.pic);
  const [firstName, setFirstName] = useState(dataBackup.firstName);
  const [lastName, setLastName] = useState(dataBackup.lastName);
  const [email, setEmail] = useState(dataBackup.email);
  const [taxId, setTaxId] = useState(dataBackup.taxId);
  const [comments, setComments] = useState(dataBackup.comments);

  //  Tab General Field
  const [emails, setEmails] = useState(dataBackup.emails);
  const [phoneNumbers, setPhoneNumbers] = useState(dataBackup.phoneNumbers);

  const [addressIndex, setAddressIndex] = useState(-1);
  const [addresses, setAddresses] = useState(dataBackup.addresses);

  //  Tab Properties
  const [accountProperties, setAccountProperties] = useState<
    interfaces.IUserOwnerPropertiesListAll[]
  >([]);
  let [properties, setProperties] = useState(dataBackup.properties);

  //  Tab Notes & History
  const [notes, setNotes] = useState(dataBackup.notes);

  //  Tab Access
  const [accountUsers, setAccountUsers] = useState<IUserListAllRes[]>([]);
  const [access, setAccess] = useState(dataBackup.access);

  //  Tab Integrations Fields
  const [rm, setRM] = useState(dataBackup.rm);

  //
  const [openInvite, setOpenInvite] = useState(false);

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
      const [allAccountUsers, propertiesAll] = await Promise.all([
        userListAllService({
          moduleKind: IModuleKind.userOwners,
        }),
        propertiesListAllService(),
      ]);

      if (!isMounted()) {
        return;
      }

      if (redirectCreated.kind) {
        //  If redirected back after creating
        if (
          redirectCreated.kind === IModuleKind.properties &&
          redirectCreated.propertyId
        ) {
          //  This is when redirecting after creating a property with its default unit
          properties.push({
            propertyId: redirectCreated.propertyId,
            propertyUnits: redirectCreated.propertyUnitId
              ? [redirectCreated.propertyUnitId]
              : [],
          });

          setActiveTab(interfaces.IOwnerCreateUpdateTabsType.properties);
        } else if (
          redirectCreated.kind === 'propertyUnits' &&
          redirectCreated.propertyUnitId
        ) {
          //  This is when redirecting after creating a unit
          const newProperties = properties.map((property) => {
            if (property.propertyId === redirectCreated.propertyId) {
              property.propertyUnits.push(
                redirectCreated.propertyUnitId as string
              );
            }

            return property;
          });

          properties = newProperties;

          setActiveTab(interfaces.IOwnerCreateUpdateTabsType.properties);
        }
      }

      const userOwnerProperitesCache: Record<string, string[]> = {};
      properties.forEach((property) => {
        userOwnerProperitesCache[property.propertyId] = property.propertyUnits;
      });

      const newAccountProperties = propertiesAll.records.map((property) => {
        let isSelected =
          userOwnerProperitesCache[property.id] !== undefined ? true : false;
        let selectedUnits = userOwnerProperitesCache[property.id] || [];

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
      setProperties(properties);

      setAccountUsers(allAccountUsers);

      //Reseting the created redirect data
      if (redirectCreated.kind) {
        reduxActionDispatch(redirectResetAction());

        //Backing up the newly created property or unit detail
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

  const OnSaveCommonValidate = (sendInvite: boolean) => {
    //  Primary, Billing and Other Address
    const primaryAddress = addresses[0];
    const billingAddress = addresses[1];

    const otherAddresses = addresses.filter((address, index) => index > 1);

    //  User Notes ID
    const userNotes = notes.map((note) => note.id);

    //  User Access
    const userAccess = { ...access };
    if (access.all) {
      userAccess.users = [];
    }

    //  User Access
    const formData: interfaces.IUserOwnerCreateReqData = {
      firstName,
      lastName,
      email,
      taxId,
      comments,
      //  Tab General Field
      emails,
      phoneNumbers,
      primaryAddress,
      billingAddress,
      addresses: otherAddresses,
      //  Tab Properties
      properties,
      //  Tab Notes & History
      notes: userNotes,
      //  Tab Access
      access: userAccess,
      //  Tab Rm Fields
      rm: {
        enabled: rm.enabled,
        displayName: rm.displayName,
      },

      sendInvite,
    };

    const validate = validateData(
      formData,
      constants.UserOwnerCreateValsScheme
    );
    if (validate.errors) {
      const errors = Object.values(validate.errors);
      warningToast(errors[0] as string);

      setErrors(validate.errors);
      setOpenInvite(false);
      return;
    }

    setIsFetching(true);
    setErrors(DefaultFormError);

    return formData;
  };

  const onSave = async (
    event: React.ChangeEvent<any> | null,
    sendInvite: boolean
  ) => {
    event?.preventDefault();

    const formData = OnSaveCommonValidate(sendInvite);
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

      const result = await services.userOwnerCreateService(formData);

      successToast(result.message);

      reduxActionDispatch(userOwnerCreateEditBackupResetAction());

      if (redirectPath) {
        //  Redirect to previous page with Data
        reduxActionDispatch(
          redirectUserOwnerCreateAction({
            userOwnerId: result.data.record.id,
          })
        );

        return history.push(redirectPath);
      }

      return history.push(UserOwnerRoutes.routes.list.path);
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

      setIsFetching(false);
    }
  };

  const backupDataFunc = async (
    newBackup?: interfaces.IUserOwnerCreateEditBackup,
    newTab: interfaces.IOwnerCreateUpdateTabsType = activeTab
  ) => {
    await sleep(100);

    const backup: interfaces.IUserOwnerCreateEditBackup = newBackup || {
      activeTab: newTab,

      id: '',

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
      notes,
      //  Tab Access
      access,
      //  Tab RM Fields
      rm,
    };

    reduxActionDispatch(
      userOwnerCreateBackupUpdateAction({
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

      <Popup
        isOpen={openInvite}
        title="Save & Invite"
        hideButton={true}
        onClose={() => setOpenInvite(false)}
        ModalName="Save & Invite"
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
        disableButtons={isFetching}
      >
        <div className="text-left">
          <div>
            <div className="d-flex justify-content-center w-100">
              <BigMail />
            </div>
            <p className="text-center mt-3">
              Generate and send platform invite link to the user.
            </p>

            <div>
              {!!redirectPath && (
                <button
                  className="btn btn-danger"
                  disabled={isFetching}
                  onClick={() => {
                    history.push(redirectPath);
                  }}
                >
                  Cancel
                </button>
              )}

              <button
                className="btn btn-primary w-100 mt-2"
                onClick={(event) => {
                  onSave(event, true);
                }}
                disabled={isFetching}
              >
                Save & Invite
              </button>
            </div>
          </div>
        </div>
      </Popup>
      <div className="px-4">
        <div className="main-heading-wrap d-flex  align-items-center justify-content-between mb-4">
          <div className="dashboard-heading-title d-flex ipad-w-100">
            <h5 className="title">Create Owner</h5>
          </div>
          <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0">
            <div className="d-md-flex">
              {!!redirectPath && (
                <button
                  className="d-none d-lg-block btn btn-danger mr-2"
                  disabled={isFetching}
                  onClick={() => {
                    history.push(redirectPath);
                  }}
                >
                  Cancel
                </button>
              )}

              <button
                className="d-none d-lg-block btn btn-primary mr-2"
                disabled={isFetching}
                onClick={() => setOpenInvite(true)}
              >
                Save & Invite
              </button>
              <button
                className="btn btn-primary"
                disabled={isFetching}
                onClick={(event) => {
                  onSave(event, false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center justify-content-lg-start">
          <div className="position-relative d-inline">
            <div className="owner-avatar">
              {pic.mediaURL ? (
                <img
                  className="account-user-img"
                  src={pic.mediaURL}
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
                    setPic({ mediaURL: '', type: '', name: '' });
                    return;
                  }

                  setPic({
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
                placeholder="First Name *"
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
                placeholder="Email *"
                value={email}
                errorMsg={errors.email}
                className="form-control form-control-sm"
                label="Email *"
                labelClassName="d-none d-md-block"
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

          <div
            onClick={() => {
              if (isFetching) {
                return;
              }

              const newActiveTab = interfaces.IOwnerCreateUpdateTabsType.notes;

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

          <div
            onClick={() => {
              if (isFetching) {
                return;
              }

              const newActiveTab = interfaces.IOwnerCreateUpdateTabsType.access;

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
        </div>

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.generalInfo && (
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

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.properties && (
          <TabProperties
            accountProperties={accountProperties}
            setAccountProperties={setAccountProperties}
            properties={properties}
            setProperties={setProperties}
            backupDataFunc={backupDataFunc}
            isFetching={isFetching}
          />
        )}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.access && (
          <TabAccess
            accountUsers={accountUsers}
            access={access}
            setAccess={setAccess}
            backupDataFunc={backupDataFunc}
          />
        )}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.notes && (
          <TabNotes
            notes={notes}
            setNotes={setNotes}
            backupDataFunc={backupDataFunc}
            userOwnerId={defaultId}
          />
        )}

        {activeTab === interfaces.IOwnerCreateUpdateTabsType.integrations && (
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
