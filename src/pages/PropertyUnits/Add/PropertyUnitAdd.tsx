import { useState, useEffect } from 'react';
import { useMountedState } from 'react-use';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { ICommonAddress, IModuleKind } from '../../../interfaces';

import { successToast, warningToast } from '../../../utils/toast';
import { validateData } from '../../../utils/joi';
import { generateMongoId } from '../../../utils/common';

import { IAppReduxState } from '../../../redux/reducer';
import { redirectPropertyUnitCreateAction } from '../../../redux/redirects/redirects.actions';

import Main from '../../../components/Layouts/Main';
import {
  TextInputComp,
  SelectInputComp,
  TextAreaComp,
  FileInputComp,
} from '../../../components/Forms';
import { RoundedCameraIcon } from '../../../components/Icons';
import { IsFetching } from '../../../components/Common';

import { mediaUploadCommonService } from '../../Common/services';

import { integrationCommonListAllService } from '../../IntegrationCommons/services';
import { DefaultIntegrationCommonOptions } from '../../IntegrationCommons/constants';

import { DefaultCommonAddress } from '../../Address/constants';
import { AddressAddEdit } from '../../Address';

import PropertyRoutes from '../../Properties/routes';
import { PropertiesCircleIcon2x } from '../../Properties/Icons';

import { IUserListAllRes } from '../../Users/interfaces';
import { userListAllService } from '../../Users/services';

import PropertyUnitRoutes from '../routes';
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

export default function UnitAdd() {
  const isMounted = useMountedState();
  const history: any = useHistory();
  const params: { propertyId: string } = useParams();
  const {
    hash,
    state,
  }: {
    hash: string;
    state?: { skipPropertyCheck: boolean };
  } = useLocation();

  const {
    // auth: { authUser },
    redirect: { redirectPath },
  } = useSelector((state: IAppReduxState) => state);
  const reduxActionDispatch = useDispatch();

  // const [propertyId = undefined] = useState(state?.propertyId);

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

  const [defaultId] = useState(generateMongoId());

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

  //  Tab Notes & History
  const [notes, setNotes] = useState(
    constants.DefaultPropertyUnitCreateEdit.notes
  );

  //  Tab Access
  const [accountUsers, setAccountUsers] = useState<IUserListAllRes[]>([]);
  const [access, setAccess] = useState(
    constants.DefaultPropertyUnitCreateEdit.access
  );

  //  Tab Integrations Fields
  const [rm, setRM] = useState(constants.DefaultPropertyUnitCreateEdit.rm);

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
    //If editing Primary Address
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

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const [allAccountUsers, intCommons] = await Promise.all([
        userListAllService({
          moduleKind: IModuleKind.properties,
        }),
        integrationCommonListAllService(),
      ]);

      if (!isMounted()) {
        return;
      }

      setAccountUsers(allAccountUsers);
      setIntegrationCommons(intCommons);
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

    //  User Access
    const formData: interfaces.IPropertyUnitCreateReqData = {
      defaultId,

      propertyId: params.propertyId,
      skipPropertyCheck: state?.skipPropertyCheck ?? false,
      name,
      unitTypes: unitTypes.map((unitType) => unitType.value),
      bedrooms,
      bathrooms,
      squareFootage,
      comments,
      //  Tab General Field
      primaryAddress: addresses[0],
      addresses: addresses.filter((address, index) => index > 0),
      //  Tab Notes & History
      notes: notes.map((note) => note.id),
      //  Tab Access
      access: userAccess,
      //  Tab Rm Fields
      rm: {
        enabled: rm.enabled,
      },
    };

    const validate = validateData(
      formData,
      constants.PropertyUnitCreateValsScheme
    );
    if (validate.errors) {
      const errors = Object.values(validate.errors);
      warningToast(errors[0] as string);

      setErrors(validate.errors);
      return;
    }

    setIsFetching(true);
    setErrors(DefaultFormError);

    try {
      if (pic.mediaURL) {
        formData.pic = await mediaUploadCommonService(pic, {
          name: 'Pic',
          moduleKind: 'propertyUnits',
        });
      }

      const result = await services.propertyUnitCreateService(formData);

      successToast(result.message);

      if (redirectPath) {
        //  Redirect to previous page with Data
        reduxActionDispatch(
          redirectPropertyUnitCreateAction({
            propertyId: params.propertyId || null,
            propertyUnitId: result.data.record.id,
          })
        );

        return history.push(redirectPath);
      }

      setIsFetching(false);

      return history.goBack();
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

      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (addressIndex !== -1) {
    return (
      <AddressAddEdit
        sideBarId={PropertyUnitRoutes.routes.add.sideBarId}
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
              <h6 className="title">Create Unit</h6>
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
              <div className="form-group">
                <SelectInputComp
                  label="Unit Types *"
                  name="unitTypes"
                  placeholder="Unit Type *"
                  value={unitTypes}
                  isMulti
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
                  errorMsg={errors.unitTypes}
                />
              </div>
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
                // steps={3}
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
                activeTab === interfaces.IPropertyUnitCreateUpdateTabsType.notes
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
          </div>

          {activeTab ===
            interfaces.IPropertyUnitCreateUpdateTabsType.generalInfo && (
            <TabGeneralInfo
              setAddressIndex={setAddressIndex}
              addresses={addresses}
              setAddresses={setAddresses}
              addressAddEvent={addressAddEvent}
              errors={errors}
            />
          )}

          {activeTab ===
            interfaces.IPropertyUnitCreateUpdateTabsType.access && (
            <TabAccess
              accountUsers={accountUsers}
              access={access}
              setAccess={setAccess}
            />
          )}

          {activeTab === interfaces.IPropertyUnitCreateUpdateTabsType.notes && (
            <TabNotes
              notes={notes}
              setNotes={setNotes}
              propertyId={params.propertyId}
              propertyUnitId={defaultId}
            />
          )}

          {activeTab ===
            interfaces.IPropertyUnitCreateUpdateTabsType.integrations && (
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
            Create
          </button>
        </div>
      </div>
    </Main>
  );
}
